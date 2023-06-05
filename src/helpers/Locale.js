import store from '../store'
const DevTools = require("./DevTools");
const IPC = require("./IPC");

export function change(lang, vuetify, i18n) {
    let lang_tag = lang;
    if (lang == "pt") {
        lang_tag = "pt-BR";
    }

    //Atualiza a meta-tag do HTML
    document.documentElement.setAttribute('lang', lang_tag);

    //Atualiza o storage
    localStorage.setItem("lang", lang);
    DevTools.write("Idioma selecionado:", lang);

    //Muda o idioma do Vuetify
    vuetify.locale.current = lang;

    //Muda o idioma da aplicação
    i18n.locale = lang;

    //Se for aplicação desktop, informa o electron sobre a mudança de idioma
    //para que as configurações sejam recarregadas,
    //e o electron mande novamente as configurações para a aplicação
    if (store.state.desktop) {
        this.getConfig(lang)
    }


    //Atualiza as variáveis
    store.state.lang = lang;
    store.state.data.lang = lang;

    //retorna o novo idioma
    return lang;
}
export function flag(lang) {
    if (lang === "pt") {
        return "br";
    } else {
        return lang;
    }
}
export function getConfig(lang, timer) {
    if (timer == undefined) {
        timer = 1000;
    }
    let self = this;
    setTimeout(function () {
        if (store.state.display < 0) {
            self.getConfig(lang, 50);
        } else if (store.state.display == 0 && lang) {
            IPC.send('config', lang);
        }
    }, timer);
}