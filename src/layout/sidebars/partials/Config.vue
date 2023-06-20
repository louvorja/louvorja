<template>
  <div>
    <div class="px-3" v-if="$store.state.desktop">
      <div class="subtitle-1 font-weight-medium">{{ $t("screens") }}</div>

      <v-switch
        v-model="$store.state.data.options.screen.fade"
        :label="$t('fading-effect-on-screens')"
        color="info"
      />
    </div>
    <div class="px-3">
      <div class="subtitle-1 font-weight-medium">{{ $t("audio") }}</div>

      <v-switch v-if="!($store.state.desktop && !$store.state.data.online)"
        v-model="$store.state.data.options.audio.lazy_load"
        :label="$t('load-while-running')"
        color="info"
      >
        <template v-slot:details>
          {{ $t("message.lazy-load-details") }}
        </template>
      </v-switch>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    fade: function () {
      return this.$store.state.data.options.screen.fade;
    },
  },
  watch: {
    fade() {
      Object.keys(this.$store.state.data.screen).map((id) => {
        this.$store.state.data.screen[id].fade = this.fade;
      });
    },
  },
};
</script>