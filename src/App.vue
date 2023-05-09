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
    <!--
    <app-album />
    <app-lyric />
    -->

    <table>
      <tr class="row-0">
        <td :colspan="2">
          <app-system-header />
        </td>
      </tr>
      <tr class="row-0">
        <td style="max-width: 0; width: 100%">
          <app-header />
        </td>

        <td rowspan="3" style="background: blue">
          XXXX
          <!--<app-music-bar />-->
        </td>
      </tr>
      <tr class="row-0">
        <td style="max-width: 0; width: 100%">
          <app-tabs />
        </td>
      </tr>
      <tr class="row-1">
        <td>
          <div style="height: 100%; overflow: auto">
            <keep-alive :include="tabs">
              <router-view />
            </keep-alive>
            <!--<app-player />-->
          </div>
        </td>
      </tr>
      <tr class="row-0">
        <td :colspan="2">
          <app-footer />
        </td>
      </tr>
      <tr class="row-0">
        <td :colspan="2">
          <app-dev-tools v-if="$store.state.debug" />
        </td>
      </tr>
    </table>
  </v-app>
</template>

<style scoped>
table {
  border: 0 !important;
  width: 100% !important;
  height: 100vh !important;
  max-height: 100vh !important;
  border-spacing: 0 !important;
  border-collapse: collapse !important;
}
.row-0 {
  height: 0;
}
.row-1 {
  height: 100%;
}
</style>

<script>
import { defineAsyncComponent } from "vue";

export default {
  components: {
    AppSideBar: defineAsyncComponent(() => import("@/layout/SideBar")),
    AppDialog: defineAsyncComponent(() => import("@/layout/Dialog")),
    AppStore: defineAsyncComponent(() => import("@/layout/store/Index")),
    AppAlert: defineAsyncComponent(() => import("@/layout/Alert")),
    //AppLyric:  defineAsyncComponent(() => import("@/layout/Lyric")),
    //AppAlbum:  defineAsyncComponent(() => import("@/layout/Album")),
    AppSystemHeader: defineAsyncComponent(() =>
      import("@/layout/SystemHeader")
    ),
    AppHeader: defineAsyncComponent(() => import("@/layout/Header")),
    AppTabs: defineAsyncComponent(() => import("@/layout/TabsPages")),
    //AppPlayer:  defineAsyncComponent(() => import("@/layout/Player")),
    AppFooter: defineAsyncComponent(() => import("@/layout/Footer")),
    //AppMusicBar:  defineAsyncComponent(() => import("@/layout/Music")),
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
  },
  created() {
    /*this.getDimensions();*/
  },
  mounted() {
    /*window.addEventListener("resize", this.getDimensions);
    window.addEventListener("load", () => {
      console.log("Página carregada 100%");
      this.getDimensions();
    });*/
  },
  unmounted() {
    /*window.removeEventListener("resize", this.getDimensions);*/
  },
  methods: {
    debugMode() {
      const Dialog = require("@/helpers/Dialog");
      this.$store.state.debug = !this.$store.state.debug;
      if (this.$store.state.debug) {
        Dialog.ok("Modo Desenvolvedor", "Modo de desenvolvedor ativado!");
      }
    },
    /*getDimensions() {
      let divs = document.querySelectorAll(".app-h-1");
      let totalHeight = 0;

      divs.forEach(function (div) {
        console.log("DIV", div.offsetHeight);
        totalHeight += div.offsetHeight;
      });

      this.app_h_1 = window.innerHeight - totalHeight;
      console.log("DP", this.app_h_1);
    },*/
  },
};
</script>
