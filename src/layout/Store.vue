<template>
  <v-dialog v-model="store.show" max-width="80%">
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
          </v-card-subtitle>
          <v-spacer></v-spacer>

          <v-tabs
            v-model="tab"
            :color="$root.data.layout.color"
            show-arrows
            grow
          >
            <v-tab
              v-for="(categoria, index) in categorias"
              :key="categoria.id_categoria"
              :data-id="index"
            >
              {{ categoria.titulo }}
            </v-tab>
          </v-tabs>
          <v-progress-linear
            v-if="carregando"
            indeterminate
            :color="$root.data.layout.color"
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
                <v-layout wrap justify-space-around>
                  <v-flex
                    v-for="(item, index) in albuns(categoria.id_categoria)"
                    :key="index"
                    class="d-flex pa-1"
                    style="justify-content: center"
                  >
                    <v-card
                      class="d-flex flex-column"
                      style="width: 100%; max-width: 150px; height: 100%"
                    >
                      <div>
                        <v-img :src="item.imagem" height="150px"></v-img>
                        <v-card-title
                          style="
                            font-size: 0.9rem;
                            word-break: initial;
                            line-height: initial;
                          "
                        >
                          {{ item.titulo }}
                        </v-card-title>
                        <v-card-subtitle
                          class="pt-2"
                          style="line-height: initial"
                        >
                          {{ item.subtitulo }}
                        </v-card-subtitle>
                      </div>
                      <div class="flex-grow-1"></div>
                      <div>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn icon>
                            <v-icon color="info" @click="baixaStore()">
                              mdi-download
                            </v-icon>
                          </v-btn>
                        </v-card-actions>
                      </div>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <div class="flex-grow-0">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text :color="$root.data.layout.color" @click="fechaStore()">Fechar</v-btn>
          </v-card-actions>
        </div>
      </v-layout>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  data() {
    return {
      tab: null,
      carregando: true,
      categorias: null,
      items: null,
    };
  },
  computed: {
    store: function () {
      return this.$root.$data.store;
    },
  },
  watch: {
    store: {
      handler: function () {
        if (this.store.show) {
          this.baixaStore();
        }
      },
      deep: true,
    },
  },
  mounted: async function () {
    //this.baixaStore();
  },
  methods: {
    baixaStore: async function () {
      this.carregando = true;
        console.log("Baixando categorias");
        let data = await this.$root.getData("store");
        this.categorias = data.categorias;


        console.log("Baixando items");
        this.items = data.albuns;

      this.carregando = false;
    },
    fechaStore: function(){
      this.store.show = false;
    },
    albuns: function (id_categoria) {
      return this.items
        ? this.items.filter((items) => items.id_categoria === id_categoria)
        : [];
    },
  },
};
</script>