<template>
  <v-card :rounded="0" :border="0" flat class="h-100 w-100">
    HOME SCREEN
    <json-viewer :value="$store.state.current_screen" />
  </v-card>
</template>

<script>
import JsonViewer from "vue-json-viewer";

export default {
  components: {
    JsonViewer,
  },
};
</script>