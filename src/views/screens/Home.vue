<template>
  <v-card :rounded="0" :border="0" flat class="h-100 w-100" :color="color">
    HOME SCREEN {{ color }}
    <json-viewer :value="$store.state.current_screen" />
  </v-card>
</template>

<script>
import JsonViewer from "vue-json-viewer";

export default {
  components: {
    JsonViewer,
  },
  computed: {
    color: function () {
      return this.$store.state.current_screen.background
        ? this.$store.state.current_screen.background.color ?? "#000000"
        : "#000000";
    },
  },
};
</script>