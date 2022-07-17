<template>
  <div class="d-flex flex-column" style="height: 100%">
    <div class="pa-3">
      <l-input
        type="text"
        v-model="search"
        label="Digite o nome da música"
        append-icon="mdi-magnify"
        :error="
          !loading && musicas.length > 0 && pagination.itemsLength === 0
        "
      />
    </div>
    <div v-if="!loading && musicas.length <= 0">
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
        :items="musicas"
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
        <template v-slot:[`item.albuns`]="{ item }">
          <v-chip
            v-for="album in item.albuns"
            :key="album.id_album"
            small
            outlined
            class="mx-2"
            :color="$root.data.layout.color"
          >
            {{ album.titulo }}
          </v-chip>
        </template>

        <template v-slot:[`item.opcoes`]="{ item }">
          <music-bar v-bind="item" v-if="true" />
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
    MusicBar: () => import("@/components/MusicBar"),
  },
  data() {
    return {
      search: null,
      loading: true,
      musicas: [],
      fields: [
        { text: "Titulo", value: "titulo" },
        { text: "Álbuns", value: "albuns" },
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
      let data = await this.$root.getData("musicas");
      let albuns_musicas = await this.$root.getData("albuns_musicas");
      let albuns = await this.$root.getData("albuns");

      data.map((musica) => {
        return (musica.albuns = albuns_musicas
          .filter((album_musica) => {
            return album_musica.id_musica == musica.id_musica;
          })
          .map((album_musica) => {
            album_musica.album = albuns.filter((album) => {
              return album.id_album == album_musica.id_album;
            });
            return album_musica;
          })
          .map((item) => {
            return item.album[0];
          }));
      });

      this.musicas = data;
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