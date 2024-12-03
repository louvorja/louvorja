<template>
  <div>
    <component
      v-for="plugin in plugins"
      :key="plugin.id"
      :is="loadPluginComponent(plugin)"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "ModulesLayout",
  computed: {
    plugins() {
      return this.$modules.get();
    },
  },
  methods: {
    loadPluginComponent(plugin) {
      return defineAsyncComponent(() => {
        // Try to load from plugin interface directory
        return import(`@/plugins/app/${plugin.id}/interface/Index.vue`).catch(
          () => {
            // Fallback to modules directory if component not found in plugin
            return import(`@/modules/${plugin.component}.vue`);
          }
        );
      });
    },
  },
};
</script>
