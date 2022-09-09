<template>
  <div
    class="d-flex align-center justify-center fill-height"
    style="background: rgba(11, 61, 98, 1)"
  >
    <ico src="louvorja" size="100" />
    <div v-if="debug" class="white flex-grow-1">
      <json-view :data="$data" />
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return this.$root.$data;
  },
  components: {
    ico: () => import(`@/components/Icon`),
  },
};
</script>