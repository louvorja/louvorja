<template>
  <v-layout style="height: inherit">
    <v-navigation-drawer
      permanent
      :theme="$store.state.data.layout.dark ? 'dark' : ''"
    >
      <v-list color="transparent">
        <v-progress-linear
          :color="$store.state.data.layout.color"
          indeterminate
          v-if="loading_categories"
        />
        <v-list-item
          v-for="category in categories"
          :key="category.id_category"
          :title="category.name"
          :style="{
            color:
              id_category == category.slug
                ? (!$store.state.data.layout.dark
                    ? $store.state.data.layout.color
                    : '#FFF') + ' !important'
                : '',
          }"
          :active="id_category == category.slug"
          @click="setCategory(category.slug)"
        />
      </v-list>

      <template v-slot:append>
        <v-list color="transparent">
          <v-list-item
            :title="$t('all-collections')"
            :style="{
              color:
                typeof id_category == 'object'
                  ? (!$store.state.data.layout.dark
                      ? $store.state.data.layout.color
                      : '#FFF') + ' !important'
                  : '',
            }"
            :active="typeof id_category == 'object'"
            @click="setCategory(all_categories)"
          />
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-main
      class="overflow-auto d-flex flex-wrap align-center justify-center"
      :style="$store.state.data.layout.dark ? 'background:#2E2E2E;' : ''"
    >
      <v-progress-circular
        :color="$store.state.data.layout.color"
        indeterminate
        v-if="loading"
      />
      <v-card
        style="min-width: 300px; max-width: 300px"
        theme="dark"
        v-for="album in albums_list"
        :key="album.id_album"
        width="320"
        class="ma-2"
        :color="album.color || '#385F73'"
        dark
        @click="openAlbum(album)"
      >
        <div class="d-flex flex-no-wrap justify-space-between align-center">
          <v-avatar class="ma-3" size="125" tile rounded="0">
            <v-img :src="album.url_image" />
          </v-avatar>
          <div class="flex-grow-1 d-flex flex-column">
            <div class="text-h6 pt-2" v-text="album.name" />

            <div
              class="h6"
              v-text="album.subtitle"
              v-show="typeof id_category == 'string'"
            />
          </div>
        </div>
      </v-card>
    </v-main>
  </v-layout>
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
      active_menu: 0,
      search: null,
      loading_categories: true,
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
    albums_list: function () {
      return this.albums.filter((value, index, array) => {
        let ids = array.map((item) => {
          return item.id_album;
        });
        let id = value.id_album;
        return ids.indexOf(id) === index;
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
      this.loading_categories = true;
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