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
    ico: () => import(`@/components/Icone`),
    geral: () => import(`@/layout/Sidebars/Geral`),
    cronometro: () => import(`@/layout/Sidebars/CronometroSidebar`),
  },
};
</script>