const DevTools = require("./DevTools");

export async function get(route, options = null, callback = function () { }) {
    let params = "";
    if (options) {
        params = `?${this.data_to_url(options)}`;
    }
    let url = `${this.url()}/${route}${params}`;

    DevTools.write('%curl', 'color:orange', url, options);

    let response = await fetch(url,
        {
            method: 'get',
            headers: {
                'Api-Token': this.api_token()
            },
        }
    ).catch(err => {
        callback(false, "Erro ao estabelecer conexão com o servidor!");
        DevTools.write('%c' + err, 'color:red');
        return false;
    });

    if (response.ok) {
        let data = await response.json();
        if (data.error != undefined && data.error != '') {
            callback(false, "Erro ao obter dados do servidor: " + data.error);
            return false;
        }
        callback(true, data.data);
        return true;
    } else {
        let data = await response.json();
        callback(false, "Erro ao obter dados do servidor: " + data.error);
        return false;
    }
}
export function base_url() {
    if (window.location.hostname == "localhost") {
        return "http://localhost:8000";
    } else {
        return "https://api.louvorja.com.br";
    }
}
export function url() {
    return `${this.base_url()}/${this.lang()}`;
}
export function lang() {
    return localStorage.getItem("lang");
}
export function data_to_url(data) {
    return Object
        .keys(data)
        .map(value => `${value}=${encodeURIComponent(data[value])}`)
        .join('&');
}
export function api_token() {
    return '02@v2nFB2Dc';
}