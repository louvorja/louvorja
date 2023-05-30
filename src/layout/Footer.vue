<template>
  <v-card
    theme="dark"
    :color="$store.state.data.layout.color"
    :rounded="0"
    class="w-100"
  >
    <span class="text-caption">&nbsp;{{ $t("version") }}: {{ version }}</span>
  </v-card>
</template>

<script>
import packageJson from "../../package.json";

export default {
  computed: {
    version: function () {
      return packageJson.version;
    },
  },
};
</script>