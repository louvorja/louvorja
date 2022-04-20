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
    all(sql, res) {
        this.db.all(sql, [], (err, rows) => {
            if (err) { console.log(err.message) };

            res.json({ model: rows });
        })
    }
}

const dbCon = new dbConnection();

app.post('/hinario', (req, res) => {
    var lang = req.body.lang.toUpperCase() || 'PT';
    const sql = `SELECT
                ALM.FAIXA,
                MUS.*
            FROM CATEGORIAS CAT
            INNER JOIN CATEGORIAS_ALBUNS CAA ON CAA.ID_CATEGORIA=CAT.ID_CATEGORIA
            INNER JOIN ALBUNS_MUSICAS ALM ON ALM.ID_ALBUM=CAA.ID_ALBUM
            INNER JOIN MUSICAS MUS ON MUS.ID_MUSICA=ALM.ID_MUSICA
            WHERE CAT.SLUG = 'hinario' AND MUS.IDIOMA='`+ lang + `'
            ORDER BY ALM.FAIXA,MUS.TITULO`;

    dbCon.all(sql, res);
})
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



app.listen(3000, () => {
    console.log('conectado a porta 3000');
})