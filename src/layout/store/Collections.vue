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
        :key="index"
        width="200px"
        class="ma-2"
      >
        <v-img
          :src="album.url_image"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="200px"
        >
          <v-card-title v-text="album.name" style="word-break: initial" />
        </v-img>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-bookmark</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card-text>
  </v-card>
</template>


<script>
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
    all_categories: function () {
      return this.categories.map((item) => {
        return item.slug;
      });
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
  },
  mounted: async function () {
    await this.loadCategories();
  },
};
</script>