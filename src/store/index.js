import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      desktop: typeof desktop !== "undefined" ? desktop : false,
      debug: false,
      config_web: null,
      lang: null,

      window: {
        router_view: { height: 0 }
      },

      path: { app_path: "", base: "", files: "", files_lang: "" },
      displays: [],
      development: false,
      portable: false,
      ip: "",
      //server: {status: false},
      platform: "",
      maximize: true,
      db_port: 0,
      //monitor: 0,

      data: {
        sync_version: { pt: null, es: null },
        db: { port: 7770 },
        lang: "pt",
        last_conn_server: null,
        downloads: {
          albums: { pt: null, es: null },
          downloaded: {
            full_tables: { pt: null, es: null },
            albums: { pt: null, es: null },
            files: {},
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

      download: {
        show: false,
        active: false,
        title: null,
        subtitle: null,
        id_album: null,
        value: null,
        max_value: null,
        file: {
          name: null,
          downloaded_size: 0,
          size: 0,
          qt_remaining: 0,
          qt_downloaded: 0,
        }
      },
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
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
