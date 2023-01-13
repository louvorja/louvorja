<template>
  <v-dialog v-model="store.show" max-width="80%" persistent>
    <v-card>
      <v-layout column fill-height style="height: 90vh">
        <v-card dark flat outlined tile style="border: 0"> TITULO </v-card>
        <v-row no-gutters style="flex-wrap: nowrap">
          <v-card
            dark
            flat
            outlined
            tile
            class="d-flex flex-column"
            style="border: 0"
          >
            <v-btn depressed x-small class="bt-column">
              <v-icon dark> mdi-download </v-icon>
              <span>Coletâneas</span>
            </v-btn>
            <v-btn depressed x-small class="bt-column">
              <v-icon dark> mdi-download </v-icon>
              <span>Bíbia</span>
            </v-btn>
            <v-btn depressed x-small class="bt-column">
              <v-icon dark> mdi-download </v-icon>
              <span>Configurações</span>
            </v-btn>
          </v-card>
          <v-col
            cols="1"
            style="min-width: 100px; max-width: 100%"
            class="flex-grow-1 flex-shrink-0"
          >
            XXXXXX
          </v-col>
        </v-row>
      </v-layout>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  components: {
    lAlbunsStore: () => import(`@/components/ListAlbumsStore`),
  },
  data() {
    return {
      tab: null,
      panel: 0,
      panels: [
        { titulo: "Disponíveis para Download", baixados: false },
        { titulo: "Baixados", baixados: true },
      ],
      loading: false,
      categories: null,
      items: null,
    };
  },
  computed: {
    store: function () {
      return this.$store.state.store;
    },
    /*
    dialog: function () {
      return this.$store.state.dialog;
    },
    downloads: function () {
      return this.$store.state.data.downloads;
    },*/
    download: function () {
      return this.$store.state.download;
    },
  },
  watch: {
    /*store: {
      handler: function () {
        if (this.store.show) {
          this.panel = 0;

          if (sessionStorage.getItem("store")) {
            console.log("Carregado do sessionStorage");
            this.items = JSON.parse(sessionStorage.getItem("store"));
          } else {
            this.refreshStore();
          }
        }
      },
      deep: true,
    },
    tab: function () {
      this.panel = 0;
    },*/
  },
  methods: {
    refreshStore: async function () {
      /*
      this.loading = true;
      console.log("Baixando categories");
      let data = await this.$store.state.getApiData("store");
      this.categories = data.categories;

      console.log("Baixando items");
      this.items = data.albuns;
      sessionStorage.setItem("store", JSON.stringify(this.items));

      this.loading = false;*/
    } /*
    closeStore: function () {
      this.store.show = false;
    },
    albuns: function (id_categoria, baixado) {
      return this.items
        ? this.items
            .filter(
              (item) =>
                item.id_categoria === id_categoria &&
                (baixado ? this.status(item) === 2 : this.status(item) != 2)
            )
            .map((item) => {
              const container = item;
              container["status"] = this.status(item);
              return container;
            })
        : [];
    },
    status: function (item) {
      return this.downloads.albuns.indexOf(item.id_album) >= 0 &&
        this.downloads.baixados.albuns.indexOf(item.id_album) < 0
        ? 1 // Pendente
        : this.downloads.baixados.albuns.indexOf(item.id_album) >= 0
        ? 2 // Baixado
        : 0; // Não baixado
    },
    downloadItem: function (item) {
      this.dialog.show = true;
      this.dialog.title = "Download";
      this.dialog.text = `Deseja baixar o álbum "${item.titulo}"?`;
      this.dialog.buttons = [
        { text: "Não", color: "error", value: "cancel" },
        { text: "Sim", color: "info", value: "ok" },
      ];
      this.dialog.value = "";

      var self = this;
      var tmr = setInterval(function () {
        if (!self.dialog.show) {
          clearInterval(tmr);
          if (self.dialog.value == "ok") {
            self.downloads.albuns.push(item.id_album);
            self.$store.state.checkDownloads();
          }
        }
      }, 100);
    },
    downloadItemAll: function () {
      this.dialog.show = true;
      this.dialog.title = "Download";
      this.dialog.text =
        "Deseja baixar todos os itens da loja para o seu dispositivo? <br><small>Esta operação pode levar muito tempo, mas não se preocupe, os arquivos serão baixados em segundo plano enquanto você usa o programa</small>";
      this.dialog.buttons = [
        { text: "Não", color: "error", value: "cancel" },
        { text: "Sim", color: "info", value: "ok" },
      ];
      this.dialog.value = "";

      var self = this;
      var tmr = setInterval(function () {
        if (!self.dialog.show) {
          clearInterval(tmr);
          if (self.dialog.value == "ok") {
            self.downloads.albuns.push(
              ...self.items.map((item) => {
                return item.id_album;
              })
            );
            //remove duplicados
            self.downloads.albuns = self.downloads.albuns.filter(function (
              item,
              i
            ) {
              return self.downloads.albuns.indexOf(item) === i;
            });
            self.$store.state.checkDownloads();
          }
        }
      }, 100);
    },*/,
  },
  mounted: async function () {
    this.refreshStore();
  },
};
</script>