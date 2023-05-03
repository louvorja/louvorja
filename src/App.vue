<template>
  <v-app :dark="data.layout.dark">
    <app-fonts-desktop v-if="desktop && !development" />
    <app-fonts v-else />

    <app-side-bar />
    <app-dialog />
    <app-store />
    <app-alert />
    <app-lyric />
    <app-album />

    <v-layout fill-height style="height: 100vh">
      <v-layout column fill-height style="height: 100vh">
        <app-header />
        <app-tabs />
        <v-main style="overflow: auto; flex: auto">
          <keep-alive :include="tabs">
            <router-view />
          </keep-alive>
        </v-main>
        <app-player />
        <app-footer />
        <app-dev-tools v-if="debug" />
      </v-layout>
      <app-music-bar />
    </v-layout>
  </v-app>
</template>

<script>
export default {
  components: {
    AppSideBar: () => import("@/layout/SideBar"),
    AppDialog: () => import("@/layout/Dialog"),
    AppStore: () => import("@/layout/store/Index"),
    AppAlert: () => import("@/layout/Alert"),
    AppLyric: () => import("@/layout/Lyric"),
    AppAlbum: () => import("@/layout/Album"),
    AppHeader: () => import("@/layout/Header"),
    AppTabs: () => import("@/layout/TabsPages"),
    AppPlayer: () => import("@/layout/Player"),
    AppFooter: () => import("@/layout/Footer"),
    AppMusicBar: () => import("@/layout/Music"),
    AppDevTools: () => import("@/layout/DevTools"),
    AppFonts: () => import("@/layout/Fonts"),
    AppFontsDesktop: () => import("@/layout/FontsDesktop"),
  },
  created() {
    document.title = "Louvor JA";
  },
  data() {
    return this.$store.state;
  },
  computed: {
    tabs: function () {
      return this.openpages.map((item) => {
        return item.name;
      });
    },
  },
};
</script>

