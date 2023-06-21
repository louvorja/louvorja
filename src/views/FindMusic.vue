<template>
  <v-card
    :theme="$store.state.data.layout.dark ? 'dark' : ''"
    :rounded="0"
    class="h-100"
  >
    <v-alert
      v-if="desktop && !loading && musics.length <= 0"
      border="bottom"
      type="warning"
      class="ma-4 minus-height"
      :text="$t('message.hymnal-not-downloaded')"
    >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="loadData">
          {{ $t("refresh-page") }}
        </v-btn>
        <v-btn @click="$store.state.store.show = true">
          {{ $t("access-store") }}
        </v-btn>
      </v-card-actions>
    </v-alert>

    <v-card-title class="minus-height">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        :label="$t('message.label-song-name')"
      />
    </v-card-title>

    <v-progress-linear
      :color="$store.state.data.layout.color"
      indeterminate
      v-if="loading"
    />
    <v-data-table-virtual
      v-else
      :headers="fields"
      :items="musics"
      :search="search"
      :no-data-text="$t('message.no-data-text')"
      class="elevation-1"
      item-value="name"
      :height="table_height"
      fixed-header
      fixed-footer
      hover
    >
      <template v-slot:[`item.albums`]="{ item }">
        <v-chip
          v-for="album in item.raw.albums"
          :key="album.id_album"
          size="small"
          class="ma-1"
          :color="
            $store.state.data.layout.dark
              ? '#FFFFFF'
              : this.$store.state.data.layout.color
          "
          @click="openAlbum(album)"
        >
          {{ album.name }}
        </v-chip>
      </template>
      <template v-slot:[`item.options`]="{ item }">
        <music-bar
          v-bind="item.raw"
          :color="
            this.$store.state.data.layout.dark
              ? '#FFFFFF'
              : this.$store.state.data.layout.color
          "
        />
      </template>
    </v-data-table-virtual>
  </v-card>
</template>

<script>
import { defineAsyncComponent } from "vue";

const Album = require("@/helpers/Album.js");
const Musics = require("@/controllers/Musics.js");
const Dialog = require("@/helpers/Dialog.js");
const Storage = require("@/helpers/Storage.js");

export default {
  components: {
    MusicBar: defineAsyncComponent(() => import("@/components/MusicBar")),
  },
  data() {
    return {
      search: "",
      loading: true,
      musics: [],
      fields: [
        {
          title: this.$t("title"),
          sortable: true,
          key: "name",
        },
        {
          title: this.$t("album"),
          key: "albums",
        },
        { title: "", key: "options" },
      ],
    };
  },
  computed: {
    page: function () {
      return this.$route.name;
    },
    lang: function () {
      return this.$store.state.data.lang;
    },
    online: function () {
      return this.$store.state.data.online;
    },
    desktop: function () {
      return this.$store.state.desktop;
    },
    table_height: function () {
      let height = this.$store.state.window.router_view.height;
      document.querySelectorAll(".minus-height").forEach((el) => {
        height -= el.offsetHeight || 0;
      });
      return height;
    },
  },
  watch: {
    async lang() {
      Storage.remove(`${this.page}:musics`);
      this.musics = [];
      await this.loadData();
    },
    async online() {
      Storage.remove(`${this.page}:musics`);
      this.musics = [];
      await this.loadData();
    },
    async lang() {
      Storage.remove(`${this.page}:musics`);
      this.musics = [];
      await this.loadData();
    },
    search() {
      Storage.set(`${this.page}:search`, this.search);
    },
  },
  methods: {
    loadData: async function () {
      this.musics = Storage.get(`${this.page}:musics`, []);
      this.loading = this.musics.length <= 0;
      Musics.list(
        { limit: -1, sort_by: "name", with_albums: 1 },
        (resp, data) => {
          if (resp) {
            this.musics = data;
            Storage.set(`${this.page}:musics`, data);
          } else {
            Dialog.error("Erro ao carregar dados", data);
          }

          this.loading = false;
        }
      );
    },
    openAlbum(id) {
      Album.open(id);
    },
  },
  mounted: async function () {
    this.search = Storage.get(`${this.page}:search`, "");
    await this.loadData();
  },
};
</script>