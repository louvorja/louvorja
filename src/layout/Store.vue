<template>
  <v-dialog v-model="store.show" max-width="80%">
    <v-card>
      <v-card-title>Loja Virtual</v-card-title>
      <v-card-subtitle
        >Baixe gratuitamente conteúdos para seu aplicativo
        LouvorJA.</v-card-subtitle
      >
      <v-spacer></v-spacer>

      <v-tabs v-model="tab" :color="$root.data.layout.color" show-arrows grow>
        <v-tab>Todos os Álbuns</v-tab>
        <v-tab>Hinário</v-tab>
        <v-tab>Temas Anuais</v-tab>
        <v-tab>Álbums Diversos</v-tab>
        <v-tab>Bíblias</v-tab>
      </v-tabs>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn> fff </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  data() {
    return {
      tab: null,
    };
  },
  computed: {
    store: function () {
      return this.$root.$data.store;
    },
  },
};
</script>