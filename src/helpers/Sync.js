import store from '../store'
const DevTools = require("./DevTools");
const System = require("./System");
const Dialog = require("./Dialog");
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
                            //Ocorreu um erro.... aborta missão para evitar loop infinito
                            Dialog.error(
                                'Erro ao criar tabela!',
                                `${ret}`,
                                function () {
                                    System.close();
                                }
                            );
                        }
                    });
                } else {

                    //Verifica se as colunas estão iguais às do servidor....
                    //Em caso de inconsistências, recria a tabela local

                    let create_columns = Object.keys(tables).filter(table => {
                        return Object.keys(tables[table].columns).filter(column => {
                            return !(Object.keys(local_tables[table].columns).includes(column))
                        }).length;
                    });

                    if (create_columns.length > 0) {
                        let table = create_columns[0];
                        DevTools.write('Recriando tabela ', table);
                        DB.post(`create_table/${table}`, tables[table], (resp, ret) => {
                            if (resp) {
                                //Retorna para a rotina de checagem de tabelas
                                this.check_tables();
                            } else {
                                //Ocorreu um erro.... aborta missão para evitar loop infinito
                                Dialog.error(
                                    'Erro ao recriar tabela!',
                                    `${ret}`,
                                    function () {
                                        System.close();
                                    }
                                );
                            }
                        });
                    } else {

                        //Todas as tabelas em ordem. Checa os dados
                        this.check_data();

                    }
                }
            }
        }

    });
}

export function check_data() {
    DevTools.write('Verificando dados');

    console.log("SINCRINUZAR DADOS")
}