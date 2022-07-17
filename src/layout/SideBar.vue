<template>
  <div>
    <system/>
    <stopwatch v-if="page == 'stopwatch'" />
  </div>
</template>


<script>
export default {
  data() {
    return this.$root.$data;
  },
  components: {
    system: () => import(`@/layout/sidebars/SystemSidebar`),
    stopwatch: () => import(`@/layout/sidebars/StopwatchSidebar`),
  },
};
</script>