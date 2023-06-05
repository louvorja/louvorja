<template>
  <v-card :rounded="0" :border="0" flat class="h-100 w-100">
    <json-viewer :value="data" />
  </v-card>
</template>

<script>
import JsonViewer from "vue-json-viewer";

export default {
  components: {
    JsonViewer,
  },
  data() {
    return {
      data: {},
    };
  },
  methods: {
    handleMessage(event, data) {
      this.data = data;
      console.log("RECEBIDO", data);
    },
    addIPCListener() {
      console.log("CRIAR");
      ipcRenderer.on("media", this.handleMessage);
    },
    removeIPCListener() {
      console.log("DESTRUIR");
      ipcRenderer.removeListener("media", this.handleMessage);
    },
  },
  mounted() {
    this.addIPCListener();
  },
  beforeUnmount() {
    this.removeIPCListener();
  },
};
</script>