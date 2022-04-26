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
              v-for="(t, index) in tabs"
              :key="t.tab"
              style="justify-content: start"
              :data-id="index"
            >
              {{ t.tab }}
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
            <v-tab-item v-for="t in tabs" :key="t.tab">
              <v-container fluid>
                <v-layout wrap justify-space-around>
                  <v-flex v-for="item in items" :key="item.id" class="pa-1">
                    <v-card class="mx-auto" style="width: 300px">
                      <v-img :src="item.imagem" height="200px"></v-img>

                      <v-card-title>{{ item.titulo }}</v-card-title>

                      <v-card-subtitle> 1,000 miles of wonder </v-card-subtitle>

                      <v-card-actions>
                        <v-btn color="orange lighten-2" text> Explore </v-btn>
                      </v-card-actions>
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
            <v-btn> fff </v-btn>
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
      items: null,
      tabs: [
        { tab: "Todos os Álbuns" },
        { tab: "Hinário" },
        { tab: "Temas Anuais" },
        { tab: "Álbuns Diversos" },
        { tab: "Bíblias" },
      ],
    };
  },
  computed: {
    store: function () {
      return this.$root.$data.store;
    },
  },
  mounted: async function () {
    this.baixaStore();
  },
  methods: {
    baixaStore: async function () {
      this.carregando = true;
      let data = await this.$root.getData("store");
      this.items = data;
      this.carregando = false;
    },
  },
};
</script>