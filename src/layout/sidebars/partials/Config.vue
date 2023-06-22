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
    <div class="px-3" v-if="$store.state.desktop">
      <div class="subtitle-1 font-weight-medium">{{ $t("music-slides") }}</div>

      <v-autocomplete
        v-for="item in [
          { id: 1, label: 'Tela do Público' },
          { id: 2, label: 'Tela do Operador' },
        ]"
        :key="item.id"
        clearable
        chips
        closable-chips
        :label="item.label"
        :items="displays"
        item-title="label"
        item-value="id"
        multiple
      >
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :prepend-avatar="item?.raw?.image"
            :title="item?.raw?.label"
            :subtitle="item?.raw?.size"
          />
        </template>
        <template v-slot:chip="{ props, item }">
          <v-chip
            v-bind="props"
            :prepend-avatar="item.raw.image"
            :text="item.raw.label"
          />
        </template>
      </v-autocomplete>

      <v-switch
        v-model="$store.state.data.options.screen.fade"
        :label="$t('fading-effect-on-screens')"
        color="info"
      />
    </div>
    <div class="px-3">
      <div
        class="subtitle-1 font-weight-medium"
        v-if="!($store.state.desktop && !$store.state.data.online)"
      >
        {{ $t("audio") }}
      </div>

      <v-switch
        v-if="!($store.state.desktop && !$store.state.data.online)"
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
    displays: function () {
      return this.$store.state.displays.map((display) => {
        return {
          id: display.id,
          name: display.label,
          label: this.$store.state.data.screen[display.id]
            ? this.$store.state.data.screen[display.id].label ?? display.label
            : display.label,
          image: this.$store.state.print_displays[display.id] ?? "",
          size: display.bounds.width + " x " + display.bounds.height,
        };
      });
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