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
const Categories = require("@/controllers/Categories.js");
const Albums = require("@/controllers/Albums.js");
const Album = require("@/helpers/Album.js");
const Dialog = require("@/helpers/Dialog.js");
const Storage = require("@/helpers/Storage.js");

export default {
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
    };
  },
  computed: {
    page: function () {
      return this.$route.name;
    },
    lang: function () {
      return this.$store.state.data.lang;
    },
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
      Storage.remove(`${this.page}:categories`);
      Storage.remove(`${this.page}:id_category`);
      this.categories = [];
      this.albums = [];
      this.id_category = null;
      await this.loadCategories();
    },
    async id_category() {
      Storage.set(`${this.page}:id_category`, this.id_category);
      this.albums = [];
      await this.loadData();
    },
  },
  methods: {
    loadCategories: async function () {
      this.categories = Storage.get(`${this.page}:categories`, []);
      this.loading_categories = this.loading_categories.length <= 0;
      this.id_category = Storage.get(`${this.page}:id_category`);
      Categories.list(
        {
          limit: -1,
          sort_by: "order,name",
          type: "collection",
        },
        (resp, data) => {
          if (resp) {
            this.categories = data;
            if (this.categories.length > 0 && !this.id_category) {
              this.id_category = this.categories[0].slug;
            }
            Storage.set(`${this.page}:categories`, data);
          } else {
            Dialog.error("Erro ao carregar dados", data);
          }
          this.loading_categories = false;
        }
      );
    },
    loadData: async function () {
      if (!this.id_category) {
        return;
      }

      this.albums = Storage.get(`${this.page}:${this.id_category}:albums`, []);
      this.loading = this.albums.length <= 0;
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
            Storage.set(`${this.page}:${this.id_category}:albums`, data);
          } else {
            Dialog.error("Erro ao carregar dados", data);
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