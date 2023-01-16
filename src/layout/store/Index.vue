<template>
  <v-dialog v-model="store.show" max-width="80%" persistent>
    <v-card>
      <v-layout column fill-height style="height: 90vh">
        <v-card dark flat outlined tile style="border: 0">
          <v-toolbar dark flat color="#1E1E1E">
            <v-icon>mdi-store</v-icon>
            <v-toolbar-title class="ml-5">{{ $t("store") }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn plain @click="close()">
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card>
        <v-row no-gutters style="flex-wrap: nowrap">
          <v-card
            dark
            flat
            outlined
            tile
            class="d-flex flex-column"
            style="border: 0"
          >
            <v-btn
              depressed
              x-small
              class="bt-column btn-navigation"
              :class="component == 'home' ? 'active' : ''"
              @click="page('home')"
            >
              <v-icon dark> mdi-home </v-icon>
              <span class="pt-2 font-weight-light">{{ $t("home") }}</span>
            </v-btn>
            <v-btn
              depressed
              x-small
              class="bt-column btn-navigation"
              :class="component == 'collections' ? 'active' : ''"
              @click="page('collections')"
            >
              <v-icon dark> mdi-music </v-icon>
              <span class="pt-2 font-weight-light">
                {{ $t("collections") }}
              </span>
            </v-btn>
            <v-btn
              depressed
              x-small
              class="bt-column btn-navigation"
              :class="component == 'bibles' ? 'active' : ''"
              @click="page('bibles')"
            >
              <v-icon dark> mdi-book-cross </v-icon>
              <span class="pt-2 font-weight-light">{{ $t("bibles") }}</span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              depressed
              x-small
              class="bt-column btn-navigation"
              :class="component == 'downloads' ? 'active' : ''"
              @click="page('downloads')"
            >
              <v-icon dark> mdi-download </v-icon>
              <span class="pt-2 font-weight-light">
                {{ $t("my-downloads") }}
              </span>
            </v-btn>
          </v-card>
          <v-col
            cols="1"
            style="min-width: 100px; max-width: 100%"
            class="flex-grow-1 flex-shrink-0"
          >
            <component :is="component" />
          </v-col>
        </v-row>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.btn-navigation:not(.active) {
  background-color: #1e1e1e;
}
button.bt-column {
  padding-top: 40px !important;
  padding-bottom: 40px !important;
}
</style>

<script>
export default {
  components: {
    home: () => import(`./Home`),
    collections: () => import(`./Collections`),
    bibles: () => import(`./Bibles`),
    downloads: () => import(`./Downloads`),
  },
  data() {
    return {
      component: "home",
    };
  },
  computed: {
    store: function () {
      return this.$store.state.store;
    },
  },
  methods: {
    close: function () {
      this.store.show = false;
    },
    page: function (page) {
      this.component = page;
    },
  },
};
</script>