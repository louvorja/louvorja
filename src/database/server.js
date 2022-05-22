const { localStorage } = require('electron-browser-storage');

const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');


var cors = require('cors');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({ origins: true, credentials: true }))

class dbConnection {

    constructor() {
        this.location = './database.db';

        this.db = new sqlite3.Database(this.location, (err) => {
            if (err) { console.log(err) };

            console.log('conexão efetuada')
        })
    }

    run(sql, res) {
        this.db.run(sql, [], (err) => {
            if (err) {
                res.send({ status: false, error: err.message });
                console.log(err.message)
            } else {
                //console.log(sql);
                res.send({ status: true, query: sql });
            }
        })
    }
    all(sql, res, callback) {
        this.db.all(sql, [], (err, rows) => {
            if (err) { console.log(err.message) };

            if (callback) {
                callback(rows);
            } else {
                res.json(rows);
            }
        })
    }
}

const dbCon = new dbConnection();

app.post('/hinario', (req, res) => {
    let lang = req.body.lang.toUpperCase() || 'PT';
    const sql = `SELECT
                ALM.FAIXA,
                MUS.*
            FROM CATEGORIAS CAT
            INNER JOIN CATEGORIAS_ALBUNS CAA ON CAA.ID_CATEGORIA=CAT.ID_CATEGORIA
            INNER JOIN ALBUNS_MUSICAS ALM ON ALM.ID_ALBUM=CAA.ID_ALBUM
            INNER JOIN MUSICAS MUS ON MUS.ID_MUSICA=ALM.ID_MUSICA
            WHERE CAT.SLUG = 'hinario' AND MUS.IDIOMA='${lang}'
            ORDER BY ALM.FAIXA,MUS.TITULO`;

    dbCon.all(sql, res);
})

app.post('/musica/:id', (req, res) => {
    let { id } = req.params;
    let sql = `SELECT * FROM MUSICAS WHERE ID_MUSICA=${id}`;
    let data;
    dbCon.all(sql, res, function (rows) {
        data = rows[0];
        let sql = `SELECT * FROM LETRAS WHERE ID_MUSICA=${id} ORDER BY ORDEM`;
        dbCon.all(sql, res, function (rows) {
            data["letra"] = rows;
            res.json(data);
        });
    });
})
/*
function musica($id){
    $sql = "SELECT * FROM LETRAS WHERE ID_MUSICA=? ORDER BY ORDEM";
    $param = ["i"=>$id];
    $r = query($sql,$param);
    $data["letra"] = @$r;
    return $data;
}
*/
/*app.get('/', (req, res) => {
    const sql = 'SELECT * FROM DADOS;'
    dbCon.all(sql, res);
})
app.get('/create/', (req, res) => {
    const sql = "INSERT INTO DADOS (TEXTO) VALUES ('" + req.query.txt + "');"
    dbCon.run(sql, res);
})
*/

app.post('/sql', (req, res) => {
    const sql = req.body.data;
    if (sql == '') {
        ret = { status: true };
        res.send(ret);
    } else {
        dbCon.run(sql, res);
    }
})


app.post('/', (req, res) => {
    ret = { status: true };
    res.send(ret);
})
app.get('/', (req, res) => {
    ret = "Banco de Dados LouvorJA";
    res.send(ret);
})

async function conectaServer() {
    let port = await localStorage.getItem("db-port") || 7770
    await localStorage.setItem("db-port", port);
    console.log('Tentando conectar BD à porta: ', port);
    try {
        app.listen(port, async (err) => {
            if (err) {
                console.log("Erro ao conectar no BD: ", err)
                await localStorage.setItem("db-message", err);
                await localStorage.setItem("db-status", false);
            }
            console.log('BD Conectado à porta: ', port);
            await localStorage.setItem("db-message", "");
            await localStorage.setItem("db-status", true);
        })
    } catch (e) {
        // Do with the error e as you see fit
        console.log('Erro ao conectar no BD:', e);
        await localStorage.setItem("db-message", e);
        await localStorage.setItem("db-status", false);
    }
}
conectaServer();