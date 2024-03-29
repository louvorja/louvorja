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


const express = require('express');
const bodyParser = require('body-parser');

const { attachPaginate } = require('knex-paginate');
attachPaginate();

var cors = require('cors');

const DB = require("./DB");
const Albums = require("./tables/Albums");
const AlbumsMusics = require("./tables/AlbumsMusics");
const Categories = require("./tables/Categories");
const CategoriesAlbums = require("./tables/CategoriesAlbums");
const Files = require("./tables/Files");
const Hymnal = require("./tables/Hymnal");
const Languages = require("./tables/Languages");
const Lyrics = require("./tables/Lyrics");
const Musics = require("./tables/Musics");

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

app.post('/create_table/:table_name', DB.create_table);
app.post('/:lang/create_table/:table_name', DB.create_table);

app.delete('/drop_tables', DB.drop_tables);
app.delete('/:lang/drop_tables', DB.drop_tables);

app.get('/:lang/albums', Albums.index);
app.get('/:lang/albums/:id', Albums.show);
app.get('/:lang/albums_musics', AlbumsMusics.index);
app.get('/:lang/categories', Categories.index);
app.get('/:lang/categories_albums', CategoriesAlbums.index);
app.get('/:lang/files', Files.index);
app.get('/:lang/hymnal', Hymnal.index);
app.get('/:lang/languages', Languages.index);
app.get('/:lang/lyrics', Lyrics.index);
app.get('/:lang/musics', Musics.index);
app.get('/:lang/musics/:id', Musics.show);

app.post('/:lang/:table', DB.store);


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