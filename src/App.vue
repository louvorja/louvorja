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

    <app-side-bar v-if="!full" />
    <app-dialog v-if="!full" />
    <app-alert v-if="!full" />
    <app-store v-if="!full" />
    <app-album v-if="!full" />
    <app-lyric v-if="!full" />
    <app-media v-if="!full" />
    <app-screen v-if="!full" />

    <div id="main-area" class="vh-100 vw-100 d-flex flex-column flex-nowrap">
      <div id="header-area">
        <app-system-header v-if="!full" />
        <app-header v-if="!full" />
        <app-tabs v-if="!full" />
      </div>
      <div
        id="router-view-area"
        :style="'flex-grow: 1;height:' + router_view_height + 'px'"
      >
        <router-view />
      </div>
      <div id="footer-area">
        <app-player v-if="!full" />
        <app-footer v-if="!full" />
        <app-dev-tools v-if="$store.state.debug && !full" />
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
    AppScreen: defineAsyncComponent(() => import("@/layout/Screen")),
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
    router_view_height: function () {
      return this.$store.state.window.router_view.height;
    },
    full: function () {
      return (
        this.$store.state.full || this.$store.state.full,
        window.location.href.includes("/screens") == true ||
          window.location.href.includes("/screen") == true
      );
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

<style>
/* Necessário para o componente <Transition> funcionar */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>