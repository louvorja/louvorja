<template>
  <v-app :dark="$root.data.layout.dark">
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
    AppStore: () => import("@/layout/store/Store"),
    AppAlert: () => import("@/layout/Alert"),
    AppLyric: () => import("@/layout/Lyric"),
    AppAlbum: () => import("@/layout/Album"),
    AppHeader: () => import("@/layout/Header"),
    AppTabs: () => import("@/layout/TabsPages"),
    AppPlayer: () => import("@/layout/Player"),
    AppFooter: () => import("@/layout/Footer"),
    AppMusicBar: () => import("@/layout/Music"),
  },
  created() {
    document.title = "Louvor JA";
  },
  computed: {
    tabs: function () {
      return this.$root.openpages.map((item) => {
        return item.name;
      });
    },
  },
};
</script>

<style>
@font-face {
  font-family: din-condensed-bold;
  src: url("~@/assets/fonts/din-condensed-bold.ttf");
}
</style>