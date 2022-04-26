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