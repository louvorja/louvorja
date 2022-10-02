<template>
  <div class="d-flex flex-column" style="height: 100%">
    <div class="pa-3">
      <l-input
        type="text"
        v-model="search"
        :label="$t('message.label-hymn-name-or-number')"
        append-icon="mdi-magnify"
        :error="!loading && musics.length > 0 && pagination.itemsLength === 0"
      />
    </div>

    <div
      id="content_scroll"
      class="pa-3"
      style="height: 100%; max-height: 100%; overflow: auto"
      @scroll="scroll"
    >
kjkkljkljkl
    </div>
  </div>
</template>

<script>
export default {
  name: "hymnal",
  components: {
    lInput: () => import(`@/components/Input`),
  },
  data() {
    return {
      search: null,
      loading: true,
      musics: [],
      fields: [
        {
          text: this.$t("number"),
          value: "track",
          align: "end",
        },
        { text: this.$t("title"), value: "name" },
        { text: "", value: "options" },
      ],
      items_page: 10,
      pagination: {
        itemsLength: -1,
      },
    };
  },
  computed: {
    lang: function () {
      return this.$root.data.lang;
    },
    desktop: function () {
      return this.$root.desktop;
    },
  },
  watch: {
    search() {

    },
    async lang() {
      this.loading = true;
      this.musics = [];
      await this.loadData();
    },
  },
  methods: {
    loadData: async function () {
      let data = await this.$root.getData("hymnal", {
        params: { limit: -1, sort_by: "track" },
      });
      this.musics = data;
      this.loading = false;
      const self = this;
      setTimeout(function () {
        self.calcItemsPage();
      }, 10);
    },
  },
  created() {

  },
  mounted: async function () {
    await this.loadData();
  },
};
</script>