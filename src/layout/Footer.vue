<template>
  <footer class="bg-secondary">&nbsp;{{ $t("version") }}: {{ version }}</footer>
</template>

<script>
import { version } from "../../package";

export default {
  computed: {
    version: function () {
      return version;
    },
  },
};
</script>