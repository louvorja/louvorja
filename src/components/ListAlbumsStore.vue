<template>
  <v-layout wrap justify-space-around>
    <v-flex
      v-for="(item, index) in items"
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
            style="font-size: 0.9rem; word-break: initial; line-height: initial"
          >
            {{ item.titulo }}
          </v-card-title>
          <v-card-subtitle class="pt-2" style="line-height: initial">
            {{ item.subtitulo }}
          </v-card-subtitle>
        </div>
        <div class="flex-grow-1"></div>
        <div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon v-if="item.status == 0" @click="$emit('download',item)">
              <v-icon color="info"> mdi-download </v-icon>
            </v-btn>

            <v-tooltip bottom v-else-if="item.status == 1">
              <template v-slot:activator="{ on }">
                <v-progress-circular
                  indeterminate
                  color="amber"
                  :size="20"
                  v-on="on"
                >
                </v-progress-circular>
              </template>
              <span>Download em andamento</span>
            </v-tooltip>

            <v-tooltip bottom v-else>
              <template v-slot:activator="{ on }">
                <v-icon color="success" v-on="on"> mdi-check </v-icon>
              </template>
              <span>Álbum baixado</span>
            </v-tooltip>
          </v-card-actions>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>



<script>
export default {
  inheritAttrs: false,
  props: [
    "items"
  ],
};
</script>