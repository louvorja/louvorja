<template>
  <l-window
    v-model="module.show"
    :title="$t(module.title)"
    :icon="module.icon"
    closable
    minimizable
    @close="$modules.close(module_id)"
    @minimize="$modules.minimize(module_id)"
  >
    <template v-slot:header>
      <v-tabs v-model="tab" align-tabs="center" :color="$theme.primary()">
        <v-tab :value="1">{{ $t("modules.dev.global-variables") }}</v-tab>
        <v-tab :value="2">{{ $t("modules.dev.user-variables") }}</v-tab>
        <v-tab :value="3">{{ $t("modules.dev.vue-variables") }}</v-tab>
      </v-tabs>
    </template>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-for="n in 3" :key="n" :value="n">
        <v-container fluid>
          <vue-json-pretty v-if="n == 1" :data="$appdata.get()" />
          <vue-json-pretty v-if="n == 2" :data="$userdata.get()" />
          <vue-json-pretty v-if="n == 3" :data="$vuetify" />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </l-window>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import LWindow from "@/components/Window.vue";

export default {
  name: "DevModule",
  components: {
    LWindow,
    VueJsonPretty,
  },
  data: () => ({
    module_id: "dev",
    tab: null,
  }),
  computed: {
    module() {
      return this.$modules.get(this.module_id);
    },
  },
};
</script>
