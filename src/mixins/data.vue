<script>
module.exports = {
  data() {
    return {
      desktop: typeof desktop !== "undefined" ? desktop : false,
      config_web: null,

      displays: [],
      ip: "",
      //server: {status: false},
      platform: "",
      maximize: true,
      //monitor: 0,

      media: {
        active: false,
        playlist: [],
        drawer: true,
        music: [
          { title: "Home", icon: "mdi-home-city" },
          { title: "My Account", icon: "mdi-account" },
          { title: "Users", icon: "mdi-account-group-outline" },
        ],
      },
      progress: {
        active: false,
        value: 0,
        text: "",
      },

      data: {
        db: {},
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
        cronometro: {
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

      content: { cronometro: 0, cronometro_list: [] },
      sidebar: { geral: false, cronometro: false },

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
    };
  },
};
</script>