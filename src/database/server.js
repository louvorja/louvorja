/* **************************
Comando para rodar o banco local por fora:
npx nodemon server.js
************************** */


//checa se o banco está rodando dentro do electron, ou por fora
let electron = false;
let storage;
try {
    storage = require('electron-browser-storage');
    electron = true;
} catch (error) {
    electron = false;
}



const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');

const DB = require("./DB");

var cors = require('cors');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({ origins: true, credentials: true }))


app.get('/', (req, res) => {
    ret = "Banco de Dados LouvorJA";
    res.send(ret);
})
app.get('/list_tables', DB.tables);
app.get('/:lang/list_tables', DB.tables);
app.get('/:lang/:table', DB.index);


async function connect() {
    let port;
    if (electron) {
        port = await storage.localStorage.getItem("db-port") || 7770
        await storage.localStorage.setItem("db-port", port);
    } else {
        port = 7770
    }
    console.log('Tentando conectar BD à porta: ', port, electron);
    try {
        app.listen(port, 'localhost', async (err) => {
            if (err) {
                console.log("Erro ao conectar no BD: ", err)
                if (electron) {
                    await storage.localStorage.setItem("db-message", err);
                    await storage.localStorage.setItem("db-status", false);
                }
            }
            console.log('BD Conectado à porta: ', port);
            if (electron) {
                await storage.localStorage.setItem("db-message", "");
                await storage.localStorage.setItem("db-status", true);
            }
        })
    } catch (e) {
        // Do with the error e as you see fit
        console.log('Erro ao conectar no BD:', e);
        if (electron) {
            await storage.localStorage.setItem("db-message", e);
            await storage.localStorage.setItem("db-status", false);
        }
    }
}
connect();