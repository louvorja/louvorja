<template>
  <v-system-bar v-if="is_desktop" id="system-bar" tile window color="primary">
    <v-icon class="me-2" icon="mdi-message"></v-icon>

    <span>Esta barra só irá aparecer na versão DESKTOP!!!!</span>

    <v-spacer />

    <v-btn icon="mdi-minus" variant="text"></v-btn>
    <v-btn icon="mdi-window-minimize" variant="text"></v-btn>
    <v-btn class="ms-2" icon="mdi-window-restore" variant="text" />
    <v-btn class="ms-2" icon="mdi-window-maximize" variant="text" />
    <v-btn class="ms-2" icon="mdi-open-in-new" variant="text" />
    <v-btn class="ms-2" icon="mdi-close" variant="text" />
  </v-system-bar>
</template>

<script>
export default {
  name: "SystemBarLayout",
  computed: {
    is_desktop() {
      return this.$appdata.get("is_desktop");
    },
  },
};
</script>

<style scoped>
#system-bar {
  position: initial !important;
  flex: 0 !important;
}
</style>
