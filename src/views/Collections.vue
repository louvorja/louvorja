<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-progress-linear indeterminate v-if="loading" />

    <v-alert type="error" v-if="error" class="ma-3">{{ error }}</v-alert>
    <div class="d-flex flex-no-wrap" style="height: inherit">
      <div>
        <v-navigation-drawer permanent :width="170" dark>
          <v-list dense nav>
            <v-list-item
              link
              v-for="category in categories"
              :key="category.id_category"
              @click="setCategory(category.slug)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ category.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link @click="setCategory(all_categories)">
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t("all-collections") }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </div>

      <div
        id="content_scroll"
        class="pa-3 w-100 d-flex flex-wrap justify-center"
        style="height: 100%; max-height: 100%; overflow: auto; flex-grow: 1"
      >
        <v-card
          style="min-width: 300px; max-width: 300px"
          v-for="(album, index) in albums"
          :key="index"
          width="320"
          class="ma-2"
          :color="album.color || '#385F73'"
          dark
          @click="openAlbum(album)"
        >
          <div class="d-flex flex-no-wrap justify-space-between align-center">
            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="album.url_image" />
            </v-avatar>
            <div class="flex-grow-1 d-flex flex-column">
              <div class="text-h6 pt-2" v-text="album.name" />

              <div class="h6" v-text="album.subtitle" />
              <!--
              <v-spacer />
              <v-divider />

              <div class="pb-2">
                <v-btn fab icon height="40px" right width="40px">
                  <v-icon>mdi-play</v-icon>
                </v-btn>
              </div>
              -->
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
const Albums = require("@/controllers/Albums.js");
const Categories = require("@/controllers/Categories.js");

const Album = require("@/helpers/Album.js");

export default {
  name: "collections",
  components: {},
  data() {
    return {
      search: null,
      loading: true,
      albums: [],
      categories: [],
      id_category: null,
      error: null,
    };
  },
  computed: {
    all_categories: function () {
      return this.categories.map((item) => {
        return item.slug;
      });
    },
  },
  watch: {
    async lang() {
      this.categories = [];
      this.albums = [];
      this.id_category = null;
      await this.loadCategories();
    },
    async id_category() {
      this.albums = [];
      await this.loadData();
    },
  },
  methods: {
    loadCategories: async function () {
      this.error = null;
      this.loading = true;
      this.id_category = null;
      Categories.list(
        {
          limit: -1,
          sort_by: "order,name",
          type: "collection",
        },
        (resp, data) => {
          if (resp) {
            this.categories = data;
            if (this.categories.length > 0) {
              this.id_category = this.categories[0].slug;
            }
          } else {
            this.error = data;
          }
          this.loading = false;
        }
      );
    },
    loadData: async function () {
      if (!this.id_category) {
        return;
      }
      this.error = null;
      this.loading = true;
      Albums.list(
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
    openAlbum(id) {
      Album.open(id);
    },
  },
  created() {},
  mounted: async function () {
    await this.loadCategories();
  },
};
</script>