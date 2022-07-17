<template>
  <div>

    <pre>
      desktop: {{ desktop }},
      displays: {{ displays }},
      ip: {{ ip }},
      platform: {{ platform }},

      ----------------------------------
      
      data: {{ data }}
    </pre>
  </div>
</template>


<script>
export default {
  name: 'relogio',
  data() {return this.$root.$data;},
}
</script>