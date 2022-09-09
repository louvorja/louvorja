<template>

    <div class="d-flex align-center justify-center fill-height" style="background:rgba(11,61,98,1)">
      <ico src="louvorja" size="100"/>
    </div>
<!--
    <div style="background:#FFF;">
      <json-view :data="$data" />
    </div>-->

</template>


<script>
export default {
  data() {return this.$root.$data;},
  components: {
    ico: () => import(`@/components/Icon`)
  }
}
</script>