<template>
  <div>
    <!-- Core modules -->
    <component
      v-for="component in components"
      :key="component"
      :is="defineAsyncComponent(() => import(`@/modules/${component}.vue`))"
    />

    <!-- Plugin modules -->
    <component
      v-for="plugin in pluginComponents"
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
    components() {
      const modules = this.$modules.get();
      return [
        ...new Set(
          Object.keys(modules)
            .filter((item) => !modules[item].type)
            .map((item) => modules[item].component)
        ),
      ];
    },
    pluginComponents() {
      const modules = this.$modules.get();
      return [
        ...new Set(
          Object.keys(modules)
            .filter((item) => modules[item].type === "plugin")
            .map((item) => modules[item])
        ),
      ];
    },
  },
  methods: {
    defineAsyncComponent,
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
