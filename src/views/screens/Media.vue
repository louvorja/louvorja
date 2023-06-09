<template>
  <v-card :rounded="0" :border="0" flat class="h-100 w-100">
    ID={{ $store.state.display }};;;
    <json-viewer :value="data" />
    <json-viewer :value="$store.state" />
    <screen :fullscreen="true" :index="index" :text="text" :image="image">
    </screen>
  </v-card>
</template>

<script>
import { defineAsyncComponent } from "vue";

import JsonViewer from "vue-json-viewer";
const Screen = require("@/helpers/Screen.js");

export default {
  components: {
    JsonViewer,
    screen: defineAsyncComponent(() => import(`@/components/screens/Media`)),
  },
  data() {
    return {
      data: {},
    };
  },
  computed: {
    index: function () {
      return (this.data && this.data.slide && this.data.slide.index) || -1;
    },
    text: function () {
      return (this.data && this.data.slide && this.data.slide.lyric) || "";
    },
    image: function () {
      return (this.data && this.data.slide && this.data.slide.url_image) || "";
    },
  },
  methods: {
    handleMessage(event, data) {
      this.data = data;
      if (!data.has_music) {
        Screen.soft_close();
      }
    },
    addIPCListener() {
      ipcRenderer.on("media", this.handleMessage);
    },
    removeIPCListener() {
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