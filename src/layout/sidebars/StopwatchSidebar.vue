<template>
  <v-navigation-drawer
    v-model="$root.sidebar.stopwatch"
    absolute
    right
    temporary
    width="350px"
  >
    <v-tabs v-model="tab" :color="$root.data.layout.color" show-arrows grow>
      <v-tab>Texto</v-tab>
      <v-tab>Fundo</v-tab>
      <v-tab>Extras</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item class="pa-3">
        <v-row>
          <l-input
            col="12"
            m="mb-4"
            type="slider"
            v-model.number="$root.data.stopwatch.text.fontSize"
            label="Tamanho"
            :min="5"
            :max="50"
          />
        </v-row>
        <v-row>
          <l-input
            col="12"
            m="mb-4"
            type="color"
            v-model="$root.data.stopwatch.text.color"
            label="Cor"
          />
        </v-row>
        <v-row>
          <l-input
            col="12"
            type="select"
            v-model="$root.data.stopwatch.text.positionH"
            label="Alinhamento Horizontal"
            options-list="positionH"
          />
        </v-row>
        <v-row>
          <l-input
            col="12"
            type="select"
            v-model="$root.data.stopwatch.text.positionV"
            label="Alinhamento Vertical"
            options-list="positionV"
          />
        </v-row>
        <v-row>
          <l-input
            col="12"
            type="checkbox"
            v-model="$root.data.stopwatch.text.cssContent"
            label="Formatação com CSS"
          />
        </v-row>
        <v-row v-if="$root.data.stopwatch.text.cssContent">
          <l-input
            col="12"
            type="textarea"
            v-model="$root.data.stopwatch.text.css"
            label="Código CSS"
          />
        </v-row>
        <v-row align="center" justify="space-around" class="ma-5">
          <v-btn
            color="error"
            @click="$root.restoreFormatacao('stopwatch.text')"
          >
            <v-icon> mdi-restore </v-icon>
            Restaurar Formatação
          </v-btn>
        </v-row>
      </v-tab-item>
      <v-tab-item class="pa-3">
        <v-row>
          <l-input
            col="12"
            type="color"
            v-model="$root.data.stopwatch.bg.color"
            label="Cor de Fundo"
          />
        </v-row>
        <v-row>
          <l-input
            col="12"
            type="file"
            v-model="$root.data.stopwatch.bg.file"
            label="Imagem de Fundo"
            accept="image/*,video/*"
          />
        </v-row>
        <v-row v-if="$root.data.stopwatch.bg.file.url">
          <l-input
            col="12"
            type="select"
            v-model="$root.data.stopwatch.bg.position"
            label="Posição"
            options-list="position"
          />
        </v-row>
        <v-row>
          <l-input
            col="12"
            type="checkbox"
            v-model="$root.data.stopwatch.bg.cssContent"
            label="Formatação com CSS"
          />
        </v-row>
        <v-row v-if="$root.data.stopwatch.bg.cssContent">
          <l-input
            col="12"
            type="textarea"
            v-model="$root.data.stopwatch.bg.css"
            label="Código CSS"
          />
        </v-row>
        <v-row align="center" justify="space-around" class="ma-5">
          <v-btn
            color="error"
            @click="$root.restoreFormatacao('stopwatch.bg')"
          >
            <v-icon> mdi-restore </v-icon>
            Restaurar Formatação
          </v-btn>
        </v-row>
      </v-tab-item>
      <v-tab-item class="pa-3">
        <v-row>
          <l-input
            col="12"
            type="range-slider"
            v-model="$root.data.stopwatch.mask"
            label="Formato de Tempo"
            :marks="{ h: 'hora', m: 'minuto', s: 'segundo', n: 'milesimo' }"
          />
        </v-row>
        <v-row align="center" justify="space-around" class="ma-5 mt-10">
          <v-btn
            color="error"
            @click="$root.restoreFormatacao('stopwatch.mask')"
          >
            <v-icon> mdi-restore </v-icon>
            Restaurar Formatação
          </v-btn>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>


<script>
export default {
  data() {
    return {
      tab: null,
    };
  },
  components: {
    lInput: () => import(`@/components/Input`),
  },
};
</script>