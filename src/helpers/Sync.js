import store from '../store'
const DevTools = require("./DevTools");
const Api = require("../services/Api");
const System = require("./System");
const Dialog = require("./Dialog");
const DB = require("../controllers/DB");

export function start() {
    DevTools.write('Inicia sincronização de dados');
    this.check_tables();
}
export function end() {
    DevTools.write('Fim da sincronização de dados');
    this.hide_download_info();
}
export function lang() {
    return store.state.lang;
}
export function show_download_info(params = {}) {
    store.state.download.show = true;
    store.state.download.title = params.title || null;
    store.state.download.subtitle = params.subtitle || null;
    store.state.download.value = params.value || null;
    store.state.download.max_value = params.max_value || null;
    console.log("ABRE DOWN", store.state.download)
}
export function hide_download_info() {
    store.state.download.show = false;
    store.state.download.title = null;
    console.log("FECHA DOWN", store.state.download)
}
export function reset_download(table) {
    if (store.state.config_web.data_transfer.full.includes(table)) {
        Object.keys(store.state.data.downloads.downloaded.full_tables).map(item => {
            store.state.data.downloads.downloaded.full_tables[item] = null;
        });
    }
    if (store.state.config_web.data_transfer.album.includes(table)) {
        Object.keys(store.state.data.downloads.downloaded.albums).map(item => {
            store.state.data.downloads.downloaded.albums[item] = null;
        });
    }
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
                    this.reset_download(table);

                    let table = create_tables[0];
                    DevTools.write('Criando tabela ', table);
                    this.show_download_info({
                        title: 'Criando tabelas no banco de dados local'
                    });
                    DB.post(`create_table/${table}`, tables[table], (resp, ret) => {
                        this.reset_download(table);
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
                        store.state.data.sync_version = null;

                        let table = create_columns[0];
                        DevTools.write('Recriando tabela ', table);
                        DB.post(`create_table/${table}`, tables[table], (resp, ret) => {
                            this.reset_download(table);
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
                        this.check_data((resp) => {
                            if (resp) {

                                this.end();

                            } else {
                                //
                            }
                        });

                    }
                }
            }
        }

    });
}

export function check_data(callback = function () { }) {
    DevTools.write('Verificando dados');

    if (!store.state.data.sync_version[this.lang()]) {
        store.state.data.sync_version[this.lang()] = null;
    }

    if (store.state.data.sync_version[this.lang()] != store.state.version) {
        DevTools.write('Ajusta versão de sincronização');
        store.state.data.downloads.downloaded.full_tables[this.lang()] = [];
        store.state.data.sync_version[this.lang()] = store.state.version;
    }

    if (!store.state.data.downloads.downloaded.full_tables[this.lang()]) {
        store.state.data.downloads.downloaded.full_tables[this.lang()] = [];
    }

    //Verifica e alimenta tabelas full
    let full_tables = store.state.config_web.data_transfer.full.filter(item => {
        return !store.state.data.downloads.downloaded.full_tables[this.lang()].includes(item);
    });
    if (full_tables.length > 0) {
        let table = full_tables[0];
        this.download_data(table, {}, (resp, ret) => {
            if (resp) {
                store.state.data.downloads.downloaded.full_tables[this.lang()].push(table);
                this.check_data(callback);
            } else {
                //Erro ao obter dados
            }
        });
        return;
    }

    if (!store.state.data.downloads.downloaded.albums[this.lang()]) {
        store.state.data.downloads.downloaded.albums[this.lang()] = [];
    }
    if (!store.state.data.downloads.albums[this.lang()]) {
        store.state.data.downloads.albums[this.lang()] = [];
    }

    //Obtém lista de albuns para download
    let download_albums = store.state.data.downloads.albums[this.lang()];
    let albums = download_albums.filter(item => {
        return !store.state.data.downloads.downloaded.albums[this.lang()].includes(item);
    });
    if (albums.length > 0) {

        this.show_download_info({
            title: 'Baixando álbuns',
        });

        let album = albums[0];
        this.download_album(album, (resp, ret) => {
            if (resp) {
                //Baixou o album
                store.state.data.downloads.downloaded.albums[this.lang()].push(album);
                this.check_data(callback);
            } else {
                //Erro ao obter dados
            }
        });
        return;
    }

    callback(true);
    return;

}

export function download_album(id_album, callback = function () { }, table_index = 0) {
    DevTools.write('Baixando album', id_album);

    if (table_index > store.state.config_web.data_transfer.album.length - 1) {
        //Não há mais tabelas para baixar
        callback(true);
        return;
    }


    let table = store.state.config_web.data_transfer.album[table_index];
    this.download_data(table, { id_album }, (resp, ret) => {
        if (resp) {
            this.download_album(id_album, callback, table_index + 1);
        } else {
            //Erro ao obter dados
        }
    });
}

export function download_data(table, filter = {}, callback = function () { }, page = 1) {
    DevTools.write('Baixando dados');
    DevTools.write(`%c${table}`, 'color:green', page);

    filter.limit = 100;
    filter.page = page;
    Api.get(table, filter, (resp, ret) => {
        if (resp) {
            if (ret.length > 0) {

                DB.post(table, ret, (resp, ret) => {
                    if (resp) {
                        //Retorna para a rotina de download, para baixar mais dados
                        this.download_data(table, filter, callback, page + 1);
                    } else {
                        //Ocorreu um erro.... aborta missão para evitar loop infinito
                        Dialog.error(
                            'Erro ao inserir dados na tabela!',
                            `${ret}`,
                            function () {
                                System.close();
                            }
                        );
                    }
                });

            } else {
                //Não tem mais dados para baixar nesta tabela... encerra download
                callback(resp);
            }
        } else {
            //Erro ao obter dados
            callback(resp, data);
        }
    });
}