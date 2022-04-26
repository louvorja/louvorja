<template>
  <v-app :dark="$root.data.layout.dark">
    <app-side-bar />
    <app-dialog />
    <app-store />
    <app-alert />
    <v-layout column fill-height style="height: 100vh">
      <app-header />
      <app-tabs />
      <v-main style="overflow: auto; flex: auto">
        <keep-alive :include="tabs">
          <router-view />
        </keep-alive>
      </v-main>
      <app-progress />
      <app-footer />
    </v-layout>
  </v-app>
</template>

<script>
export default {
  components: {
    AppHeader: () => import('@/layout/Header'),
    AppFooter: () => import('@/layout/Footer'),
    AppProgress: () => import('@/layout/Progress'),
    AppTabs: () => import('@/layout/TabsPages'),
    AppSideBar: () => import('@/layout/SideBar'),
    AppDialog: () => import('@/layout/Dialog'),
    AppStore: () => import('@/layout/Store'),
    AppAlert: () => import('@/layout/Alert'),
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