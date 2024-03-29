import store from '../store'

const Storage = require("../helpers/Storage");
const DevTools = require("../helpers/DevTools");

export function get(route, options = null, callback = function () { }) {
    this.call("get", route, options, null, false, (resp, data) => {
        callback(resp, data);
    });
}
export function get_local(route, options = null, callback = function () { }) {
    this.call("get", route, options, null, true, (resp, data) => {
        callback(resp, data);
    });
}

export function post(route, body = null, callback = function () { }) {
    this.call("post", route, null, body, false, (resp, data) => {
        callback(resp, data);
    });
}
export function post_local(route, body = null, callback = function () { }) {
    this.call("post", route, null, body, true, (resp, data) => {
        callback(resp, data);
    });
}

export function remove(route, callback = function () { }) {
    this.call("delete", route, null, null, false, (resp, data) => {
        callback(resp, data);
    });
}
export function remove_local(route, callback = function () { }) {
    this.call("delete", route, null, null, true, (resp, data) => {
        callback(resp, data);
    });
}


export async function call(method, route, options = null, body = null, local = false, callback = function () { }) {
    let params = "";
    if (options) {
        params = `?${this.data_to_url(options)}`;
    }
    let url;
    let info_local;
    if (local) {
        url = `${this.url_local()}/${route}${params}`;
        info_local = 'banco de dados';
    } else {
        url = `${this.url()}/${route}${params}`;
        info_local = 'servidor';
    }
    let key_storage = 'api:' + (this.url().split("/").pop() + '.' + route + params).replace(/\/|\.|\?|=|\&/g, ".");

    DevTools.write('%curl', 'color:orange', url, options);

    let headers;
    if (local) {
        headers = { 'Content-Type': 'application/json' };
    } else {
        headers = { 'Api-Token': this.api_token() };
    }

    if (body) {
        body = JSON.stringify(body || {});
    }

    if (!local) {
        let data = Storage.get(key_storage); // Pega do Session
        if (data) {
            //Existe no Storage
            //Verifica se ainda está na validade
            let valid = Date.now() <= data.expires;
            if (valid) {
                //Retorna os dados do session
                DevTools.write('%cObteve da session ' + key_storage, 'color:orange');
                callback(true, data.data);
                return true;
            }
        }
    }

    let response = await fetch(url,
        {
            method,
            headers,
            body
        }
    ).catch(err => {
        callback(false, `Erro ao estabelecer conexão com o ${info_local}!`);
        DevTools.write('%c' + err, 'color:red');
        return false;
    });

    if (response.ok) {
        let data = await response.json();
        if (data.error != undefined && data.error != '') {
            callback(false, `Erro ao obter dados do  ${info_local}:  ${data.error}`);
            return false;
        }

        if (!local) {
            const expirationMinutes = 60 * 24; // 24 horas
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (expirationMinutes * 60 * 1000)); // Calcula a data de expiração

            Storage.set(key_storage, {
                expires: expirationDate.getTime(), // Salva o timestamp da data de expiração
                data: data.data,
            })
        }

        callback(true, data.data);
        return true;
    } else {
        let data = await response.json();
        callback(false, `Erro ao obter dados do  ${info_local}:  ${data.error}`);
        return false;
    }
}
export function base_url(local = false) {
    let port = store.state.db_port || store.state.data.db.port;
    if (local) {
        return `http://localhost:${port}`;
    } else {
        if (window.location.hostname == "localhost_") {
            return "http://localhost:8000";
        } else {
            return "https://api.louvorja.com.br";
        }
    }
}
export function url() {
    return `${this.base_url()}/${this.lang()}`;
}
export function url_local() {
    return `${this.base_url(true)}/${this.lang()}`;
}
export function lang() {
    return store.state.lang;
}
export function data_to_url(data) {
    return new URLSearchParams(data).toString();
}
export function api_token() {
    return '02@v2nFB2Dc';
}