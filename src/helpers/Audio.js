import store from '../store'
const DevTools = require("./DevTools");
const Musics = require("../controllers/Musics.js");
const Alert = require("./Alert");
const Time = require("./Time");

export function open(obj, options = {}) {
    this.presentation(obj, options);
}
export function presentation(obj, options = {}) {
    let id_music = obj;
    store.state.media.album = '';
    store.state.media.track = 0;
    if (typeof (obj) === "object") {
        id_music = obj.id_music;
        store.state.media.album = obj.album || '';
        store.state.media.track = obj.track || 0;
    }
    store.state.media.audio = (options.audio || 0);
    /*
    options.audio:
    0 = sem audio
    1 = cantado
    2 = playback
    */
    var audio = document.getElementById('slide-audio');
    if (audio.duration > 0) {
        audio.pause();
        audio.currentTime = 0;
    }

    store.state.media.show = true;
    store.state.media.loading = true;
    store.state.media.slide = 0;
    store.state.media.id_music = id_music;
    Musics.show(id_music, (resp, data) => {
        if (resp) {

            if (store.state.media.audio == 1) {
                store.state.media.file = data.url_music;
                data.lyric.map(item => { item.time = Time.hms_to_seconds(item.time) || 0; });
                DevTools.write(data.lyric);
            } else if (store.state.media.audio == 2) {
                DevTools.write(data);
                store.state.media.file = data.url_instrumental_music;
                data.lyric.map(item => { item.time = Time.hms_to_seconds(item.instrumental_time) || Time.hms_to_seconds(item.time) || 0; });
            } else {
                store.state.media.file = "";
            }
            store.state.media.music = data;

            if (audio.duration > 0 && audio.paused && store.state.media.file !== "") {
                audio.play();
            }

        } else {
            Alert.error(data)
        }

        store.state.media.loading = false;
    });
}
export function player(obj, options = {}) {
    let id_music = obj;
    store.state.player.album = '';
    store.state.player.track = 0;
    if (typeof (obj) === "object") {
        id_music = obj.id_music;
        store.state.player.album = obj.album || '';
        store.state.player.track = obj.track || 0;
    }
    store.state.player.audio = (options.audio || 0);
    /*
    options.audio:
    1 = cantado
    2 = playback
    */
    var audio = document.getElementById('player-media');
    if (audio.duration > 0) {
        audio.pause();
        audio.currentTime = 0;
    }

    store.state.player.show = true;
    store.state.player.loading = true;
    store.state.player.id_music = id_music;

    Musics.show(id_music, (resp, data) => {
        if (resp) {
            if (store.state.player.audio == 1) {
                store.state.player.file = data.url_music;
            } else if (store.state.player.audio == 2) {
                store.state.player.file = data.url_instrumental_music;
            } else {
                store.state.player.file = "";
            }
            store.state.player.name = data.name;
            store.state.player.music = data;

            if (audio.duration > 0 && audio.paused && store.state.player.file !== "") {
                audio.play();
            }
        } else {
            Alert.error(data)
        }

        store.state.player.loading = false;
    });
}
export function lyric(obj) {
    let id_music = obj;
    DevTools.write(obj);
    store.state.lyric.album = '';
    store.state.lyric.track = 0;
    if (typeof (obj) === "object") {
        id_music = obj.id_music;
        store.state.lyric.album = obj.album || '';
        store.state.lyric.track = obj.track || 0;
    }
    store.state.lyric.show = true;
    store.state.lyric.loading = true;

    Musics.show(id_music, (resp, data) => {
        if (resp) {
            store.state.lyric.music = data;
        } else {
            Alert.error(data)
        }

        store.state.lyric.loading = false;
    });


}