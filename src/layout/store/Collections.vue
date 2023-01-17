<template>
  <v-card flat class="d-flex flex-column h-100">
    <v-card-title>{{ $t("collections") }}</v-card-title>
    <v-divider class="mx-4" v-if="!loading_categories"></v-divider>
    <v-progress-linear indeterminate v-if="loading_categories" />
    <v-alert type="error" v-if="error" class="ma-3">{{ error }}</v-alert>
    <v-card-text>
      <v-tabs show-arrows v-if="!loading_categories">
        <v-tab @click="setCategory(all_categories)">
          {{ $t("all-collections") }}
        </v-tab>
        <v-tab
          v-for="category in categories"
          :key="category.id_category"
          @click="setCategory(category.slug)"
        >
          {{ category.name }}
        </v-tab>
      </v-tabs>
    </v-card-text>

    <v-card-text
      style="height: 0px"
      class="flex-grow-1 flex-shrink-1 overflow d-flex flex-wrap justify-center"
    >
      <!-- LOADING -->
      <v-card
        v-show="loading"
        v-for="index in 4"
        :key="index"
        width="200px"
        height="255px"
        class="ma-2"
      >
        <v-skeleton-loader class="mx-auto" type="card" />
      </v-card>

      <!-- ITEMS -->
      <v-card
        v-for="(album, index) in albums"
        :key="album.id_album + '_' + index"
        width="200px"
        class="ma-2"
      >
        <v-img
          :src="album.url_image"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="200px"
          :style="
            !downloaded_albums.includes(album.id_album)
              ? 'filter: grayscale(100%);'
              : ''
          "
        >
          <v-card-title v-text="album.name" style="word-break: initial" />
        </v-img>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn v-if="current_album == album.id_album" icon>
            <v-progress-circular :size="22" indeterminate color="amber">
              <v-icon color="amber" :size="15">mdi-download</v-icon>
            </v-progress-circular>
          </v-btn>
          <v-btn v-else-if="downloaded_albums.includes(album.id_album)" icon>
            <v-icon color="success">mdi-check-bold</v-icon>
          </v-btn>
          <v-hover
            v-slot="{ hover }"
            v-else-if="pending_albums.includes(album.id_album)"
          >
            <v-btn @click="cancel_download(album)" icon>
              <v-icon v-if="hover" color="red">mdi-close-circle-outline</v-icon>
              <v-progress-circular
                v-else
                :size="22"
                indeterminate
                color="amber"
              />
            </v-btn>
          </v-hover>
          <v-btn v-else @click="download_album(album)" icon>
            <v-icon color="primary">mdi-download</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card-text>
  </v-card>
</template>


<script>
const Sync = require("@/helpers/Sync");
const Dialog = require("@/helpers/Dialog");
const Api = require("@/services/Api");

export default {
  data() {
    return {
      loading_categories: false,
      loading: false,
      albums: [],
      categories: [],
      id_category: null,
      error: null,
    };
  },
  computed: {
    lang: function () {
      return this.$store.state.lang;
    },
    all_categories: function () {
      return this.categories.map((item) => {
        return item.slug;
      });
    },
    downloaded_albums: function () {
      return this.$store.state.data.downloads.downloaded.albums[this.lang];
    },
    pending_albums: function () {
      return this.$store.state.data.downloads.albums[this.lang].filter(
        (item) => {
          return !this.$store.state.data.downloads.downloaded.albums[
            this.lang
          ].includes(item);
        }
      );
    },
    current_album: function () {
      return this.$store.state.download.id_album;
    },
  },
  watch: {
    async id_category() {
      this.albums = [];
      await this.loadData();
    },
  },
  methods: {
    loadCategories: async function () {
      this.error = null;
      this.loading_categories = true;
      this.id_category = null;
      Api.get(
        "categories",
        {
          limit: -1,
          sort_by: "order,name",
          type: "collection",
        },
        (resp, data) => {
          if (resp) {
            this.categories = data;
            if (this.categories.length > 0) {
              this.id_category = this.all_categories;
            }
          } else {
            this.error = data;
          }
          this.loading_categories = false;
        }
      );
    },
    loadData: async function () {
      if (!this.id_category) {
        return;
      }
      this.error = null;
      this.loading = true;
      Api.get(
        "albums",
        {
          limit: -1,
          with_categories: 1,
          categories_slug: this.id_category,
          sort_by: typeof this.id_category == "string" ? "order,name" : "name",
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
    setCategory(id) {
      this.id_category = id;
    },
    download_album(album) {
      Dialog.yesno(
        "Baixar álbum",
        `Deseja fazer o download do álbum "${album.name}"?`,
        (resp) => {
          if (resp == "yes") {
            this.$store.state.data.downloads.albums[this.lang].push(
              album.id_album
            );

            if (!this.$store.state.download.active) {
              Sync.start();
            }
          }
        }
      );
    },
    cancel_download(album) {
      let indx = this.$store.state.data.downloads.albums[this.lang].indexOf(
        album.id_album
      );
      if (indx > -1) {
        this.$store.state.data.downloads.albums[this.lang].splice(indx, 1);
      }
    },
  },
  mounted: async function () {
    await this.loadCategories();
  },
};
</script>