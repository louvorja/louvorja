<template>
  <div class="w-100 h-100" style="background: #000">
    <component v-if="module" :is="loadPluginComponent()" />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "PopupPage",
  data: () => ({
    message: null,
  }),
  computed: {
    module() {
      return this.$appdata.get("popup_module");
    },
  },
  methods: {
    loadPluginComponent() {
      return defineAsyncComponent(() => {
        // Try to load from plugin interface directory
        return import(`@/plugins/app/${this.module}/interface/Popup.vue`).catch(
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
  mounted() {
    this.$appdata.set("is_popup", true);
    window.addEventListener("message", (event) => {
      if (event.origin === window.location.origin) {
        this.message = event.data;
        if (event.data.param) {
          this.$appdata.set(event.data.param, event.data.value);
        }
      }
    });

    window.opener.postMessage("mounted", window.location.origin);
  },
};
</script>
