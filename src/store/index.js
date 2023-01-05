import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    desktop: typeof desktop !== "undefined" ? desktop : false,
    debug: false,
    config_web: null,
    lang: null,

    path: { base: "", files: "" },
    displays: [],
    ip: "",
    //server: {status: false},
    platform: "",
    maximize: true,
    db_port: 0,
    //monitor: 0,

    data: {
      db: { port: 7770 },
      lang: "pt",
      downloads: {
        albuns: [],
        musicas: [],
        baixados: {
          albuns: [],
          musicas: [],
        },
      },
      media: {
        mini: false,
      },
      fav: [],
      layout: { id: 1, color: "#29569b", dark: false },
      stopwatch: {
        text: {
          fontSize: 14,
          color: "#000000FF",
          positionV: "center",
          positionH: "center",
          cssContent: false,
          css: "",
        },
        bg: {
          color: "#FFFFFFFF",
          file: {},
          position: "center center",
          cssContent: false,
          css: "",
        },
        mask: ["m", "n"],
      },
    },
    def: {},

    content: { stopwatch: 0, stopwatch_list: [] },
    sidebar: { geral: false, stopwatch: false },
    save_data: false,
    openpages: [],
    page: "",
    show_arrows: true,
    active_header_tab: null,
    tabs_dot: [],

    dialog: {
      show: false,
      title: "",
      text: "",
      buttons: [],
      value: "",
    },
    alert: {
      show: false,
      text: null,
      type: "",
      timeout: 5000,
    },
    store: {
      show: false,
    },
    media: {
      show: false,
      loading: false,
      playlist: [],
      music: [],
      slide: 0,
      progress: 0,
      audio: 0,
      file: '',
      is_paused: true,
      id_musica: 0,
      current_time: 0,
      duration: 0,
      album: '',
      track: 0,
    },
    player: {
      show: false,
      loading: false,
      music: [],
      progress: 0,
      audio: 0,
      file: '',
      is_paused: true,
      id_music: 0,
      current_time: 0,
      duration: 0,
      album: '',
      track: 0,
    },
    progress: {
      show: false,
      value: 0,
      text: "",
    },
    lyric: {
      show: false,
      loading: false,
      music: {},
      album: '',
      track: 0,
    },
    album: {
      show: false,
      loading: false,
      album: {},
      musics: {},
    },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
