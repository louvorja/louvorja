<template>
  <v-dialog v-model="store.show" max-width="80%" persistent>
    <v-card>
      <v-layout column fill-height style="height: 90vh">
        <div class="flex-grow-0">
          <v-card-title>
            <span>Loja Virtual</span>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon color="info" @click="baixaStore()">mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            Baixe gratuitamente conteúdos para seu aplicativo LouvorJA.
            <v-alert v-if="progress" dense text border="left" type="info">
              O programa está baixando os arquivos em segundo plano. Pode fechar
              esta janela e continuar navegando enquanto o download é feito.
            </v-alert>
          </v-card-subtitle>
          <v-spacer></v-spacer>

          <v-tabs
            v-model="tab"
            :color="$state.store.data.layout.color"
            show-arrows
            grow
          >
            <v-tab
              v-for="(categoria, index) in categorias"
              :key="categoria.id_categoria"
              :data-id="index"
            >
              {{ categoria.titulo }}
              <v-chip small class="ms-2">{{
                albuns(categoria.id_categoria, false).length
              }}</v-chip>
            </v-tab>
          </v-tabs>
          <v-progress-linear
            v-if="carregando"
            indeterminate
            :color="$state.store.data.layout.color"
          >
          </v-progress-linear>
        </div>
        <div class="flex-grow-1" style="overflow: auto; flex: auto">
          <v-tabs-items v-model="tab">
            <v-tab-item
              v-for="categoria in categorias"
              :key="categoria.id_categoria"
            >
              <v-container fluid>
                <v-expansion-panels v-model="panel">
                  <v-expansion-panel v-for="(p, index) in panels" :key="index">
                    <v-expansion-panel-header>
                      {{ p.titulo }} &nbsp;
                      <span style="font-weight: bold">
                        {{ albuns(categoria.id_categoria, p.baixados).length }}
                      </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <l-albuns-store
                        v-if="
                          albuns(categoria.id_categoria, p.baixados).length > 0
                        "
                        :items="albuns(categoria.id_categoria, p.baixados)"
                        @download="downloadItem($event)"
                      />
                      <v-alert v-else dense text border="left" type="warning">
                        Não há itens para serem exibidos neste local!
                      </v-alert>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <div class="flex-grow-0">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="info" v-if="items" @click="downloadItemAll()">
              Baixar Tudo
            </v-btn>
            <v-btn text color="error" @click="closeStore()">Fechar</v-btn>
          </v-card-actions>
        </div>
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
      carregando: true,
      categorias: null,
      items: null,
    };
  },
  computed: {
    store: function () {
      return this.$state.store.store;
    },
    dialog: function () {
      return this.$state.store.dialog;
    },
    downloads: function () {
      return this.$state.store.data.downloads;
    },
    progress: function () {
      return this.$state.store.progress.active;
    },
  },
  watch: {
    store: {
      handler: function () {
        if (this.store.show) {
          this.panel = 0;

          if (sessionStorage.getItem("store")) {
            console.log("Carregado do sessionStorage");
            this.items = JSON.parse(sessionStorage.getItem("store"));
          } else {
            this.baixaStore();
          }
        }
      },
      deep: true,
    },
    tab: function () {
      this.panel = 0;
    },
  },
  mounted: async function () {
    //this.baixaStore();
  },
  methods: {
    baixaStore: async function () {
      this.carregando = true;
      console.log("Baixando categorias");
      let data = await this.$state.store.getApiData("store");
      this.categorias = data.categorias;

      console.log("Baixando items");
      this.items = data.albuns;
      sessionStorage.setItem("store", JSON.stringify(this.items));

      this.carregando = false;
    },
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
            self.$state.store.checkDownloads();
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
            self.$state.store.checkDownloads();
          }
        }
      }, 100);
    },
  },
};
</script>