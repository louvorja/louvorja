<template>
  <footer :class="{ 'bg-dark': $store.state.data.layout.dark }">
    <span class="text-caption">&nbsp;{{ $t("version") }}: {{ version }}</span>
  </footer>
</template>

<style scoped>
footer {
  background-color: #ddd;
}
footer.bg-dark {
  background-color: #2e2e2e;
  color: #e5e5e5;
}
</style>
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