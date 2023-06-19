import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      desktop: typeof desktop !== "undefined" ? desktop : false,
      debug: false,
      config_web: null,
      lang: null,

      window: {
        main: { height: 0 },
        router_view: { height: 0 }
      },

      path: { app_path: "", base: "", files: "", files_lang: "" },
      displays: [],
      active_displays: {},
      print_displays: {},
      development: false,
      portable: false,
      ip: "",
      //server: {status: false},
      platform: "",
      maximize: true,
      db_port: 0,
      display: -1,
      current_screen: {},

      data: {
        sync_version: { pt: null, es: null },
        db: { port: 7770 },
        lang: "pt",
        online: false,
        last_conn_server: null,
        screen: {},
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
      full: false,
      show_arrows: true,
      active_header_tab: null,
      tabs_dot: [],

      internet: {
        status: 'offline'
      },
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
        id_music: 0,
        has_music: false,
        is_paused: true,
        file: '',
        playlist: [],
        music: [],
        slides: [],
        slide: {
          index: -1,
          number: 0,
          count: 0,
          start_time: 0,
          end_time: 0,
          url_image: '',
          lyric: '',
          progress: 0,
        },
        progress: 0,
        buffered: 0,
        audio: 0,
        volume: 100,
        current_time: 0,
        duration: 0,
        album: {
          id_album: 0,
          name: "",
          url_image: "",
          color: "#0A1736"
        },
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
      screen: {
        show: false,
      },

      defauls: {
        color_palette: [
          ['#000000', '#9E9E9E', '#FFFFFF'],
          ['#FF6D00', '#FFAB00', '#FFD600'],
          ['#1B5E20', '#827717', '#64DD17'],
          ['#01579B', '#006064', '#00B8D4'],
          ['#B71C1C', '#880E4F', '#FF80AB'],
        ]
      }
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
