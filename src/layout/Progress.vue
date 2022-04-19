<template>
  <div v-if="progress.active">
    <div style="min-height: 4px">
      <v-progress-linear
        v-model="progress.value"
        :active="progress.active"
        :indeterminate="progress.value == -1"
      ></v-progress-linear>
    </div>
    <span class="px-3">{{ progress.text }}</span>
  </div>
</template>


<script>
export default {
  computed: {
    progress: function () {
      return this.$root.progress;
    },
  },
};
</script>