<template>
  <div class="d-flex flex-column" style="height: 100%">
    <div class="pa-3">
      <l-input
        type="text"
        v-model="search"
        label="Digite o nome ou número do hino"
        append-icon="mdi-magnify"
        :error="!loading && musics.length > 0 && pagination.itemsLength === 0"
      />
    </div>
    <div v-if="!loading && musics.length <= 0">
      <v-alert
        border="bottom"
        colored-border
        type="warning"
        elevation="2"
        class="mx-4"
      >
        O hinário não foi baixado em seu programa. Acesse a loja e faça o
        download do hinário!
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" @click="loadData"> Atualizar Página </v-btn>
          <v-btn color="info" @click="$root.$data.store.show = true">
            Acessar Loja
          </v-btn>
        </v-card-actions>
      </v-alert>
    </div>
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
        no-data-text="Não há dados para serem exibidos"
        no-results-text="Nenhum resultado encontrado"
        loading-text="Carregando..."
        dense
        @pagination="pagination = $event"
      >
        <template v-slot:[`item.options`]="{ item }">
          <music-bar
            v-bind="{ ...item, album: 'Hinário Adventista' }"
            v-if="true"
          />
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "hymnal",
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
        {
          text: "Número",
          value: "track",
          align: "end",
        },
        { text: "Titulo", value: "name" },
        { text: "", value: "options" },
      ],
      items_page: 10,
      pagination: {
        itemsLength: -1,
      },
    };
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
        if (value !== undefined && isNaN(value)) {
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
      let data = await this.$root.getData("hymnal", {
        params: { limit: -1 },
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
    window.addEventListener("scroll", this.handleScroll);
  },
  mounted: async function () {
    await this.loadData();
  },
};
</script>