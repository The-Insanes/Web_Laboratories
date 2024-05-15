"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();
var jsonParser = bodyParser.json();
const configuration = {
    hostname: "127.0.0.1",
    port: 3000
};
app.listen(configuration, () => {
    console.log(`Conectando al server http://localhost:${configuration.port}`);
});
app.get('/get_data', (req, res) => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
        }
        try {
            const jsonData = JSON.parse(data);
            res.send(JSON.stringify(jsonData));
        }
        catch (err) {
            res.status(500).send('Error de JSON');
        }
    });
});
app.get('/search_rut', jsonParser, (req, res) => {
    const rut = req.body.rut;
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        try {
            const jsonData = JSON.parse(data);
            const newElement = jsonData.find((x) => x.rut === rut);
            console.log(newElement);
            if (newElement) {
                res.status(200).send("dato encontrado");
            }
            else {
                res.status(200).send("dato no encontrado");
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
});
app.post('/add_data', jsonParser, (req, res) => {
    const new_element = req.body;
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        try {
            const jsonData = JSON.parse(data);
            const exist = jsonData.some((x) => x.rut === new_element.rut);
            if (exist) {
                return res.status(200).send(`Elemento con rut ${new_element.rut} existe`);
            }
            jsonData.push(new_element);
            fs.writeFile('./data.json', JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error reading file');
                }
                res.status(200).send('Dato nuevo agregado con éxito');
            });
        }
        catch (err) {
            res.status(500).send(`xd ${err}`);
        }
    });
});
app.put('/update_data/:rut', jsonParser, (req, res) => {
    const rut = req.body.rut;
    const new_element = req.body;
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        try {
            const jsonData = JSON.parse(data);
            const index = jsonData.findIndex((x) => x.rut === rut);
            if (index !== -1) {
                jsonData[index] = new_element;
                fs.writeFile('./data.json', JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        return res.status(500).send('Error reading file');
                    }
                    res.status(200).send("Rut actualizado con éxito!");
                });
            }
            else {
                res.status(200).send("Rut no encontrado");
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
});
app.delete('/delete_data/:rut', jsonParser, (req, res) => {
    const rut = req.body.rut;
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        try {
            let jsonData = JSON.parse(data);
            const exist = jsonData.some((x) => x.rut === rut);
            if (!exist) {
                return res.status(200).send(`No existe el rut ${rut}`);
            }
            jsonData = jsonData.filter((x) => x.rut !== rut);
            fs.writeFile('./data.json', JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error reading file');
                }
                res.status(200).send("Rut eliminado con éxito!");
            });
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
});
