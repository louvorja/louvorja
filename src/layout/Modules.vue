<template>
  <div v-if="import_modules">
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
    import_modules() {
      return this.$appdata.get("import_modules");
    },
  },
  methods: {
    loadPluginComponent(plugin) {
      return defineAsyncComponent(() => {
        // Try to load from plugin interface directory
        return import(`@/plugins/app/${plugin.id}/interface/Index.vue`).catch(
          (e) => {
            this.$alert.error({
              text: "messages.error_import_module",
              error: e,
            });
          }
        );
      });
    },
  },
};
</script>
