<template>
  <div class="d-flex flex-column" style="height: 100%">
    <div class="pa-3">
      <l-input
        type="text"
        v-model="search"
        label="Digite o nome ou número do hino"
        append-icon="mdi-magnify"
        :error="!carregando && pagination.itemsLength === 0"
      />
    </div>
    <div
      id="content_scroll"
      class="pa-3"
      style="height: 100%; max-height: 100%; overflow: auto"
      @scroll="scroll"
    >
      <v-data-table
        :headers="fields"
        :items="hinos"
        :items-per-page="items_page"
        :search="search"
        :custom-filter="filterPerfectMatch"
        :loading="carregando"
        :disable-pagination="false"
        no-data-text="Não há dados para serem exibidos"
        no-results-text="Nenhum resultado encontrado"
        loading-text="Carregando..."
        dense
        @pagination="pagination = $event"
      >
        <template v-slot:[`item.opcoes`]="{ item }">
          <opc-musica v-bind="item" v-if="true" />
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "hinario",
  components: {
    lInput: () => import(`@/components/Input`),
    OpcMusica: () => import("@/components/OpcMusica"),
  },
  data() {
    return {
      search: null,
      carregando: true,
      hinos: [],
      fields: [
        {
          text: "Número",
          value: "faixa",
          align: "end",
        },
        { text: "Titulo", value: "titulo" },
        { text: "", value: "opcoes" },
      ],
      items_page: 5,
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
        this.items_page = this.items_page + 5;
        const self = this;
        setTimeout(function () {
          self.calcItemsPage();
        }, 10);
      }
    },
    filterPerfectMatch(value, search) {
      if (isNaN(search)) {
        if (value !== undefined && isNaN(value)) {
          return value.toLowerCase().indexOf(search.toLowerCase()) > -1;
        } else {
          return false;
        }
      } else {
        return value != null && value == search;
      }
    },
  },
  created() {
    //console.log("CREATED");
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    //console.log("DESTROY");
  },
  mounted: async function () {
    //console.log("MOUNTED", this.hinos.length);
    let data = await this.$root.getData("hinario");
    this.hinos = data;
    this.carregando = false;
    const self = this;
    setTimeout(function () {
      self.calcItemsPage();
    }, 10);
  },
};
</script>