<template>
  <div class="d-flex flex-column" style="height: 100%">
    <div class="pa-3">
      <l-input
        type="text"
        v-model="search"
        :label="$t('message.label-song-name')"
        append-icon="mdi-magnify"
        :error="!loading && musics.length > 0 && pagination.itemsLength === 0"
      />
    </div>
    <div v-if="desktop && !loading && musics.length <= 0">
      <v-alert
        border="bottom"
        colored-border
        type="warning"
        elevation="2"
        class="mx-4"
      >
        {{ $t("musics-not-downloaded") }}
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" @click="loadData">
            {{ $t("refresh-page") }}
          </v-btn>
          <v-btn color="info" @click="$store.state.store.show = true">
            {{ $t("access-store") }}
          </v-btn>
        </v-card-actions>
      </v-alert>
    </div>

    <v-alert type="error" v-if="error" class="mx-3">{{ error }}</v-alert>

    <div
      id="content_scroll"
      class="pa-3"
      style="height: 100%; max-height: 100%; overflow: auto"
      @scroll="scroll"
    >
      <v-data-table
        :headers="fields"
        :items="musics"
        :items-per-page="items_page"
        :search="search"
        :custom-filter="filterPerfectMatch"
        :loading="loading"
        :disable-pagination="false"
        :no-data-text="$t('message.no-data-text')"
        :no-results-text="$t('message.no-results-text')"
        :loading-text="$t('message.loading-text')"
        dense
        @pagination="pagination = $event"
      >
        <template v-slot:[`item.albums`]="{ item }">
          <v-chip
            v-for="album in item.albums"
            :key="album.id_album"
            small
            outlined
            class="mx-2"
            :color="$store.state.data.layout.color"
          >
            {{ album.name }}
          </v-chip>
        </template>

        <template v-slot:[`item.options`]="{ item }">
          <music-bar v-bind="item" v-if="true" />
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
const Musics = require("@/controllers/Musics.js");
const AlbumsMusics = require("@/controllers/AlbumsMusics.js");
const Albums = require("@/controllers/Albums.js");

export default {
  name: "find-musics",
  components: {
    lInput: () => import(`@/components/Input`),
    MusicBar: () => import("@/components/MusicBar"),
  },
  data() {
    return {
      search: null,
      loading: true,
      musics: [],
      fields: [
        { text: this.$t("title"), value: "name" },
        { text: this.$t("album"), value: "albums" },
        { text: "", value: "options" },
      ],
      items_page: 10,
      pagination: {
        itemsLength: -1,
      },
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
    search() {
      this.items_page = 5;
      document
        .getElementById("content_scroll")
        .scrollTo({ top: 0, behavior: "smooth" });
      const self = this;
      setTimeout(function () {
        self.calcItemsPage();
      }, 10);
    },
    async lang() {
      this.musics = [];
      await this.loadData();
    },
  },
  methods: {
    scroll: function (evt) {
      if (
        evt.srcElement.scrollHeight - evt.srcElement.scrollTop <=
          evt.srcElement.clientHeight + 100 &&
        this.pagination.itemsPerPage < this.pagination.itemsLength
      ) {
        this.items_page = this.items_page + 5;
      }
    },
    calcItemsPage: function () {
      if (
        document.getElementById("content_scroll").scrollHeight <=
          document.getElementById("content_scroll").clientHeight &&
        this.pagination.itemsPerPage < this.pagination.itemsLength
      ) {
        this.items_page = this.items_page + 10;
        const self = this;
        setTimeout(function () {
          self.calcItemsPage();
        }, 10);
      }
    },
    filterPerfectMatch: function (value, search) {
      if (isNaN(search)) {
        if (value !== undefined && isNaN(value) && typeof value !== "object") {
          return (
            value
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .indexOf(
                search
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              ) > -1
          );
        } else {
          return false;
        }
      } else {
        return value != null && value == search;
      }
    },
    loadData: async function () {
      this.error = null;
      this.loading = true;
      Musics.list(
        { limit: -1, sort_by: "name", with_albums: 1 },
        (resp, data) => {
          if (resp) {
            this.musics = data;
            const self = this;
            setTimeout(function () {
              self.calcItemsPage();
            }, 10);
          } else {
            this.error = data;
          }

          this.loading = false;
        }
      );
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  mounted: async function () {
    await this.loadData();
    console.log(this.musics);
  },
};
</script>