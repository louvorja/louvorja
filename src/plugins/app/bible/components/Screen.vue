<template>
  <div style="color: red">
    ..
    <pre>{{ bible }}</pre>
    ..
  </div>
</template>

<script>
import manifest from "../manifest.json";

export default {
  name: "ScreenBiblePage",
  computed: {
    /* COMPUTEDS OBRIGATÓRIAS - INÍCIO */
    /* NÃO MODIFICAR */
    module_id() {
      return manifest.id;
    },
    module() {
      return this.$modules.get(this.module_id);
    },
    /* COMPUTEDS OBRIGATÓRIAS - FIM */
    bible() {
      return this.$appdata.get("modules.bible.data");
    },
  },
};
</script>
