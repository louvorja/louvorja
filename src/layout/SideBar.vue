<template>
  <div>
    <system />
    <stopwatch v-if="page == 'stopwatch'" />
  </div>
</template>


<script>
import { defineAsyncComponent } from "vue";

export default {
  components: {
    system: defineAsyncComponent(() =>
      import("@/layout/sidebars/SystemSidebar")
    ),
    stopwatch: defineAsyncComponent(() =>
      import("@/layout/sidebars/StopwatchSidebar")
    ),
  },
  data() {
    return this.$store.state;
  },
};
</script>