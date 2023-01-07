import store from '../store'
const DevTools = require("./DevTools");
const DB = require("../controllers/DB");

export function start() {
    DevTools.write('Inicia sincronização de dados');
    this.check_tables();
}

export function check_tables() {
    DevTools.write('Verificando tabelas');

    //Obtem a lista de tabelas no banco local
    DB.get("list_tables", null, (resp, ret) => {

        if (resp) {
            let local_tables = ret;

            //Compara com as tabelas do servidor, e verifica se estão todas criadas
            if (store.state.config_web && store.state.config_web.tables) {
                let tables = store.state.config_web.tables;

                let create_tables = Object.keys(tables).filter(table => {
                    return !local_tables[table]
                });

                if (create_tables.length > 0) {
                    //Existem tabelas para serem criadas... cria as tabelas na base local

                    let table = create_tables[0];
                    DevTools.write('Criando tabela ', table);
                    DB.post(`create_table/${table}`, tables[table], (resp, ret) => {
                        if (resp) {
                            //Retorna para a rotina de checagem de tabelas
                            this.check_tables();
                        } else {
                            DevTools.write('%cErro', 'color:red', ret);
                            //Ocorreu um erro.... aborta missão para evitar loop infinito
                        }
                    });
                }else{

                    //Verifica se as colunas estão iguais às do servidor....
                    //Em caso de inconsistências, recria a tabela local

                    //.......................ROTINA AQUI..............//

                }


                console.log(resp, ret, tables, create_tables);
            }
        }

    });
}