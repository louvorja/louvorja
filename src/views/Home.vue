<template>
  <div
    class="d-flex align-center justify-center fill-height"
    style="background: rgba(11, 61, 98, 1)"
  >
    <ico src="louvorja" size="100" />
    <div v-if="debug" style="width: 100%; height: 100%; overflow: auto">
      <json-viewer :value="$data" />
    </div>
  </div>
</template>


<script>
import { defineAsyncComponent } from "vue";
import JsonViewer from "vue-json-viewer";

export default {
  components: {
    JsonViewer,
    ico: defineAsyncComponent(() => import(`@/components/Icon`)),
  },
  data() {
    return this.$store.state;
  },
};
</script>