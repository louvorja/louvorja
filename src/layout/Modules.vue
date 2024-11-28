<template>
  <div>
    <component
      v-for="component in components"
      :key="component"
      :is="defineAsyncComponent(() => import(`@/modules/${component}.vue`))"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "ModulesLayout",
  computed: {
    components() {
      const modules = this.$modules.get();
      return [
        ...new Set(Object.keys(modules).map((item) => modules[item].component)),
      ];
    },
  },
  methods: {
    defineAsyncComponent,
  },
};
</script>
