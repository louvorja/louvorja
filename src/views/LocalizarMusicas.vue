<template>
  <div class="d-flex flex-column" style="height: 100%">
    <div class="pa-3">
      <l-input
        type="text"
        v-model="search"
        label="Digite o nome ou número do hino"
        append-icon="mdi-magnify"
        :error="!carregando && hinos.length > 0 && pagination.itemsLength === 0"
      />
    </div>
    <div v-if="!carregando && hinos.length <= 0">
      <v-alert
        border="bottom"
        colored-border
        type="warning"
        elevation="2"
        class="mx-4"
      >
        Nenhuma música foi baixada em seu programa. Acesse a loja e faça o
        download das músicas!
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
          <opc-musica
            v-bind="item"
            v-if="true"
          />
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "localizar-musicas",
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
      let data = await this.$root.getData("musicas");
      this.hinos = data;
      this.carregando = false;
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