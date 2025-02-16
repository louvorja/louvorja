<template>
  <ModuleContainer ref="moduleContainer" :manifest="manifest">
    <template v-slot:header>
      <v-toolbar>
        <v-spacer />
        <v-divider vertical />
        <LScreenBtn module="clock" />
      </v-toolbar>
    </template>
    <Screen />
  </ModuleContainer>
</template>

<script>
import Screen from "../components/Screen.vue";
import LScreenBtn from "@/components/buttons/Screen.vue";

export default {
  name: manifest.id,
  components: {
    ModuleContainer,
    Screen,
    LScreenBtn,
  },
  data: () => ({
    tab: null,
  }),
};
</script>

<!-- ########################################################### -->
<!-- ####### SETUP OBRIGATÓRIA PARA INSTALAÇÃO DO MODULO ####### -->
<!-- ########################################################### -->
<script setup>
import manifest from "../manifest.json";
import ModuleContainer from "@/layout/ModuleContainer.vue";
import { ref } from "vue";
const moduleContainer = ref(null);
/*const t = (key) => {
  return moduleContainer.value?.t(key) || key;
};*/
</script>
<!-- ########################################################### -->
<!-- ########################################################### -->
<!-- ########################################################### -->
