<template>
  <div>
    <system/>
    <stopwatch v-if="page == 'stopwatch'" />
  </div>
</template>


<script>
export default {
  data() {
    return this.$store.state;
  },
  components: {
    system: () => import(`@/layout/sidebars/SystemSidebar`),
    stopwatch: () => import(`@/layout/sidebars/StopwatchSidebar`),
  },
};
</script>