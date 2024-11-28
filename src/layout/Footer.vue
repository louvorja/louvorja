<template>
  <v-footer id="footer-bar" class="pa-0" color="primary">
    <l-player v-if="$media.isMinimized()" location="footer" />
    <v-row v-else justify="center" no-gutters> </v-row>
  </v-footer>
</template>

<script>
import LPlayer from "@/components/Player.vue";

export default {
  name: "FooterLayout",
  components: {
    LPlayer,
  },
};
</script>

<style scoped>
#footer-bar {
  flex: 0 !important;
}
</style>
