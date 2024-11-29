<template>
  <div class="w-100 h-100" style="background: #000">
    <p-media v-if="module == 'media'" />
  </div>
</template>

<script>
import PMedia from "@/views/popup/Media.vue";

export default {
  name: "PopupPage",
  components: {
    PMedia,
  },
  data: () => ({
    message: null,
  }),
  computed: {
    module() {
      return this.$appdata.get("popup_module");
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
