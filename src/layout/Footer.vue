<template>
  <v-card
    v-if="!(media.has_music && !media.show)"
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
    media: function () {
      return this.$store.state.media;
    },
  },
};
</script>