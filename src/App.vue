<template>
  <v-app
    :dark="$store.state.data.layout.dark"
    v-shortkey="['alt', 'f12']"
    @shortkey="debugMode()"
  >
    <app-fonts-desktop
      v-if="$store.state.desktop && !$store.state.development"
    />
    <app-fonts v-else />

    <app-side-bar />
    <app-dialog />
    <app-alert />
    <app-store />
    <app-album />
    <app-lyric />
    <app-media />

    <div id="main-area" class="vh-100 vw-100 d-flex flex-column flex-nowrap">
      <div id="header-area">
        <app-system-header />
        <app-header />
        <app-tabs />
      </div>
      <div
        id="router-view-area"
        :style="'flex-grow: 1;height:' + router_view_height + 'px'"
      >
        <router-view />
      </div>
      <div id="footer-area">
        <app-player />
        <app-footer />
        <app-dev-tools v-if="$store.state.debug" />
      </div>
    </div>
  </v-app>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  components: {
    AppSideBar: defineAsyncComponent(() => import("@/layout/SideBar")),
    AppDialog: defineAsyncComponent(() => import("@/layout/Dialog")),
    AppAlert: defineAsyncComponent(() => import("@/layout/Alert")),
    AppStore: defineAsyncComponent(() => import("@/layout/store/Index")),
    AppAlbum: defineAsyncComponent(() => import("@/layout/Album")),
    AppLyric: defineAsyncComponent(() => import("@/layout/Lyric")),
    AppSystemHeader: defineAsyncComponent(() =>
      import("@/layout/SystemHeader")
    ),
    AppHeader: defineAsyncComponent(() => import("@/layout/Header")),
    AppTabs: defineAsyncComponent(() => import("@/layout/TabsPages")),
    AppMedia: defineAsyncComponent(() => import("@/layout/Media")),
    AppPlayer: defineAsyncComponent(() => import("@/layout/Player")),
    AppFooter: defineAsyncComponent(() => import("@/layout/Footer")),
    AppDevTools: defineAsyncComponent(() => import("@/layout/DevTools")),
    AppFonts: defineAsyncComponent(() => import("@/layout/Fonts")),
    AppFontsDesktop: defineAsyncComponent(() =>
      import("@/layout/FontsDesktop")
    ),
  },
  data() {
    return {
      app_h_1: 0,
    };
  },
  computed: {
    tabs: function () {
      return this.$store.state.openpages.map((item) => {
        return item.name;
      });
    },
    router_view_height: function () {
      return this.$store.state.window.router_view.height;
    },
  },
  methods: {
    debugMode() {
      const Dialog = require("@/helpers/Dialog");
      this.$store.state.debug = !this.$store.state.debug;
      if (this.$store.state.debug) {
        Dialog.ok("Modo Desenvolvedor", "Modo de desenvolvedor ativado!");
      }
    },
    mainArea() {
      this.$store.state.window.main.height =
        document.getElementById("main-area").offsetHeight;

      this.$store.state.window.router_view.height =
        document.getElementById("main-area").offsetHeight -
        document.getElementById("header-area").offsetHeight -
        document.getElementById("footer-area").offsetHeight;
    },
  },
  mounted() {
    window.addEventListener("load", () => {
      this.mainArea();
    });

    /* * ROTINA PARA MONITORAR ELEMENTOS * */
    var ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        this.mainArea();
      }
    });

    //Monitora alterações na altura do elemento
    ro.observe(document.getElementById("main-area"));
    ro.observe(document.getElementById("header-area"));
    ro.observe(document.getElementById("footer-area"));
  },
};
</script>
