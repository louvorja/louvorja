<template>
  <div>
    <div class="d-flex align-items-center justify-content-center h-100" style="background:rgba(11,61,98,1)">
      <ico src="louvorja" size="100"/>
    </div>

    <a href="javascript:" @click="media.active=!media.active">MUSICA</a>

    <div style="background:#FFF;">
      <pre>{{this.$root.path}}...</pre>
      <pre>{{progress}}</pre>
      <pre>{{$data}}</pre>
    </div>
  </div>
</template>


<script>
export default {
  data() {return this.$root.$data;},
  components: {
    ico: () => import(`@/components/Icone`)
  }
}
</script>