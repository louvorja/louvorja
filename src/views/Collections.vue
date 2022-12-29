<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-progress-linear indeterminate v-if="loading" />

    <v-alert type="error" v-if="error" class="ma-3">{{ error }}</v-alert>

    <div
      id="content_scroll"
      class="pa-3"
      style="height: 100%; max-height: 100%; overflow: auto"
    >
      <div class="d-flex flex-row flex-wrap justify-center">
        <v-card
          width="400"
          class="ma-2"
          v-for="album in albums"
          :key="album.id_album"
          :color="album.color || '#385F73'"
          dark
        >
          <div class="d-flex flex-no-wrap justify-space-between">
            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="album.url_image"></v-img>
            </v-avatar>
            <div class="flex-grow-1 d-flex flex-column">
              <div class="text-h6 pt-2" v-text="album.name" />

              <div class="h6" v-text="album.subtitle" />

              <v-spacer />
              <v-divider />

              <div class="pb-2">
                <v-btn fab icon height="40px" right width="40px">
                  <v-icon>mdi-play</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
const Albums = require("@/controllers/Albums.js");

export default {
  name: "collections",
  components: {},
  data() {
    return {
      search: null,
      loading: true,
      albums: [],
      error: null,
    };
  },
  computed: {
    lang: function () {
      return this.$store.state.data.lang;
    },
    desktop: function () {
      return this.$store.state.desktop;
    },
  },
  watch: {
    search() {},
    async lang() {
      this.albums = [];
      await this.loadData();
    },
  },
  methods: {
    loadData: async function () {
      this.error = null;
      this.loading = true;
      Albums.list(
        {
          limit: -1,
          with_categories: 1,
          categories_slug: "aym",
          sort_by: "order",
        },
        (resp, data) => {
          if (resp) {
            this.albums = data;
          } else {
            this.error = data;
          }
          this.loading = false;
        }
      );
    },
  },
  created() {},
  mounted: async function () {
    await this.loadData();
  },
};
</script>