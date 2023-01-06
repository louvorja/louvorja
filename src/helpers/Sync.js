const DevTools = require("./DevTools");
const DB = require("../controllers/DB");

export function start() {
    DevTools.write('Inicia sincronização de dados');

    //Obtem a lista de tabelas no banco local
    DB.get("list_tables", data, (resp, ret) => {
        console.log(resp, ret);
    });
}