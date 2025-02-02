<template>
  <l-window
    v-model="module.show"
    :title="t('title')"
    :icon="module.icon"
    closable
    minimizable
    @close="$modules.close(module_id)"
    @minimize="$modules.minimize(module_id)"
  >
    <template v-slot:header>
      <v-tabs v-model="tab" align-tabs="center" :color="$theme.primary()">
        <v-tab :value="1">{{ t("modules") }}</v-tab>
        <v-tab :value="2">{{ t("global-variables") }}</v-tab>
        <v-tab :value="3">{{ t("user-variables") }}</v-tab>
        <v-tab :value="4">{{ t("vue-variables") }}</v-tab>
      </v-tabs>
    </template>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-for="n in 4" :key="n" :value="n">
        <v-container fluid>
          <module-list v-if="n == 1" />
          <vue-json-pretty v-if="n == 2" :data="$appdata.get()" />
          <vue-json-pretty v-if="n == 3" :data="$userdata.get()" />
          <vue-json-pretty v-if="n == 4" :data="$vuetify" />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </l-window>
</template>

<script>
import manifest from "../manifest.json";

import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import LWindow from "@/components/Window.vue";

import ModuleList from "../components/ModuleList.vue";

export default {
  name: "DevModule",
  components: {
    LWindow,
    VueJsonPretty,
    ModuleList,
  },
  data: () => ({
    tab: null,
  }),
  computed: {
    /* COMPUTEDS OBRIGATÓRIAS - INÍCIO */
    /* NÃO MODIFICAR */
    module_id() {
      return manifest.id;
    },
    module() {
      return this.$modules.get(this.module_id);
    },
    /* COMPUTEDS OBRIGATÓRIAS - FIM */
  },
  methods: {
    /* METHODS OBRIGATÓRIOS - INÍCIO */
    /* NÃO MODIFICAR */
    t(text) {
      return this.$t(`modules.${this.module_id}.${text}`);
    },
    /* METHODS OBRIGATÓRIOS - FIM */
  },
};
</script>
