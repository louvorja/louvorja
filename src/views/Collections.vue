<template>
  <div class="d-flex flex-column" style="height: 100%">

    <v-alert type="warning">Em construção</v-alert>

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
      return this.$store.state.data.lang;
    },
    desktop: function () {
      return this.$store.state.desktop;
    },
  },
  watch: {
    search() {},
    async lang() {
      this.loading = true;
      this.musics = [];
      await this.loadData();
    },
  },
  methods: {
    loadData: async function () {
      /*
      let data = await this.$root.getData("hymnal", {
        params: { limit: -1, sort_by: "track" },
      });
      this.musics = data;
      this.loading = false;
      const self = this;
      setTimeout(function () {
        self.calcItemsPage();
      }, 10);
      */
    },
  },
  created() {},
  mounted: async function () {
    await this.loadData();
  },
};
</script>