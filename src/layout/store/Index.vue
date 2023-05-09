<template>
  <v-dialog v-model="store.show" max-width="80%" persistent>
    <v-card>
      <v-toolbar
        theme="dark"
        :color="$store.state.data.layout.color"
        :title="$t('download-center')"
        density="compact"
      >
        <template v-slot:prepend>
          <v-icon>mdi-briefcase-download</v-icon>
        </template>
        <template v-slot:append>
          <v-btn icon @click="close()">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>

      <v-layout>
        <v-navigation-drawer
          theme="dark"
          :color="$store.state.data.layout.color"
          permanent
        >
          <v-list color="transparent">
            <v-list-item
              prepend-icon="mdi-home"
              :title="$t('home')"
              :class="component == 'home' ? 'active' : ''"
              :active="component == 'home'"
              @click="page('home')"
            />
            <v-list-item
              prepend-icon="mdi-music-clef-treble"
              :title="$t('hymnals')"
              :class="component == 'hymnals' ? 'active' : ''"
              :active="component == 'hymnals'"
              @click="page('hymnals')"
            />
            <v-list-item
              prepend-icon="mdi-music"
              :title="$t('collections')"
              :class="component == 'collections' ? 'active' : ''"
              :active="component == 'collections'"
              @click="page('collections')"
            />
            <v-list-item
              prepend-icon="mdi-book-cross"
              :title="$t('bibles')"
              :class="component == 'bibles' ? 'active' : ''"
              :active="component == 'bibles'"
              @click="page('bibles')"
            />
          </v-list>

          <template v-slot:append>
            <v-list color="transparent">
              <v-list-item
                prepend-icon="mdi-download"
                :title="$t('my-downloads')"
                :class="component == 'downloads' ? 'active' : ''"
                :active="component == 'downloads'"
                @click="page('downloads')"
              />
            </v-list>
          </template>
        </v-navigation-drawer>
        <v-main style="height: 80vh">
          <component :is="component" />
        </v-main>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.active {
  color: #fff !important;
}
</style>

<script>
import { defineAsyncComponent } from "vue";

export default {
  components: {
    home: defineAsyncComponent(() => import(`./Home`)),
    hymnals: defineAsyncComponent(() => import(`./Hymnals`)),
    collections: defineAsyncComponent(() => import(`./Collections`)),
    bibles: defineAsyncComponent(() => import(`./Bibles`)),
    downloads: defineAsyncComponent(() => import(`./Downloads`)),
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