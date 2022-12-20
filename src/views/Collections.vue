<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-alert type="error" v-if="error" class="ma-3">{{ error }}</v-alert>

    <div
      id="content_scroll"
      class="pa-3"
      style="height: 100%; max-height: 100%; overflow: auto"
    >
      <pre>{{ albums }}</pre>
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
        { limit: -1, with_categories: 1, categories_slug: "aym" },
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