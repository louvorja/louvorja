<template>
  <v-app id="app-container">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
#app-container > div {
  height: 100vh;
}
</style>
