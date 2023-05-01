import store from '../store'
const Albums = require("../controllers/Albums.js");
const Alert = require("./Alert");

export function open(obj) {
    store.state.album.album = obj;
    store.state.album.show = true;

    store.state.album.loading = true;
    Albums.show(obj.id_album, (resp, data) => {
        if (resp) {
            store.state.album.album = data;
            store.state.album.musics = data.musics;
        } else {
            Alert.error(data);
        }
        store.state.album.loading = false;
    });

}
export function close() {
    store.state.album.show = false;
    store.state.album.album = {};
    store.state.album.musics = {};
}
