<template>
  <div>
    <geral/>
    <cronometro v-if="page == 'cronometro'" />
  </div>
</template>


<script>
export default {
  data() {
    return this.$root.$data;
  },
  components: {
    geral: () => import(`@/layout/sidebars/GeralSidebar`),
    cronometro: () => import(`@/layout/sidebars/CronometroSidebar`),
  },
};
</script>