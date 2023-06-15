<template>
  <v-dialog v-model="screen.show" width="80%">
    <v-card id="screen-card">
      <div class="d-flex flex-no-wrap align-stretch">
        <div class="flex-grow-1 d-flex align-center">
          <v-card-title class="text-h4 font-weight-light">
            {{ $t("screens") }}
          </v-card-title>
        </div>

        <div class="d-flex align-start">
          <v-btn
            variant="text"
            icon="mdi-close"
            size="small"
            @click.native="closeScreen()"
          />
        </div>
      </div>

      <v-card-text class="overflow">
        <v-slide-group show-arrows v-model="model">
          <v-slide-group-item v-for="display in displays" :key="display.id">
            <v-card
              class="mx-1 d-flex flex-column"
              :min-width="200"
              :color="
                display.active
                  ? $store.state.active_displays[display.id]
                    ? 'amber-lighten-3'
                    : 'grey-lighten-3'
                  : 'grey-lighten-5'
              "
            >
              <v-img
                cover
                :src="$store.state.print_displays[display.id] ?? ''"
                :height="100"
                :max-height="100"
                :style="!display.active && 'opacity:.5;'"
              />
              <v-card-text class="pa-1 ma-0 flex-grow-1">
                <div
                  class="d-flex flex-nowrap flex-row align-center justify-space-between"
                >
                  <div
                    :style="
                      'font-weight: bold;' + (!display.active && 'opacity:.3;')
                    "
                  >
                    {{ display.label }}
                  </div>

                  <v-btn
                    variant="plain"
                    size="small"
                    icon="mdi-pencil"
                    @click="renameScreenDialog(display.id, display.label)"
                  />
                </div>
                <div v-if="display.name != display.label" class="text-caption">
                  {{ display.name }}
                </div>
                <div v-if="display.bounds" class="text-caption">
                  {{ display.bounds.width }} x {{ display.bounds.height }}
                </div>
                <div v-else class="text-red text-center">
                  <v-icon icon="mdi-monitor-off" /> {{ $t("no-signal") }}
                </div>
                {{ display.background }}
              </v-card-text>
              <v-card-actions class="ma-0 pa-1">
                <v-tooltip :text="$t('message.screen-background')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon
                      variant="text"
                      @click="
                        formatScreenDialog(display.id, display.background)
                      "
                    >
                      <v-avatar
                        v-bind="props"
                        :color="display.background.color"
                        :style="'border: 3px solid ' + display.background.color"
                        image="https://cdn.vuetifyjs.com/images/john.jpg"
                      />
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-tooltip :text="$t('message.screen-always-on-top')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      class="ms-2"
                      variant="text"
                      size="small"
                      :icon="
                        $store.state.data.screen[display.id].always_on_top
                          ? 'mdi-fit-to-screen'
                          : 'mdi-fit-to-screen-outline'
                      "
                      @click="alwaysOnTopScreen(display.id)"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="$t('message.screen-lock')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      class="ms-2"
                      variant="text"
                      size="small"
                      :icon="
                        $store.state.data.screen[display.id].lock
                          ? 'mdi-lock'
                          : 'mdi-lock-open-outline'
                      "
                      @click="lockScreen(display.id)"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip
                  v-if="!display.active"
                  :text="$t('message.screen-delete')"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      class="ms-2"
                      variant="text"
                      size="small"
                      icon="mdi-trash-can-outline"
                      @click="deleteScreen(display.id)"
                    />
                  </template>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="ms-2"
          variant="text"
          size="small"
          color="info"
          @click="identifyMonitors()"
        >
          {{ $t("identify-monitors") }}
        </v-btn>
        <v-btn
          class="ms-2"
          variant="text"
          size="small"
          color="info"
          @click="refreshScreen()"
        >
          {{ $t("refresh-screens") }}
        </v-btn>
        <v-btn
          class="ms-2"
          variant="text"
          size="small"
          color="red"
          @click="closeScreen()"
        >
          {{ $t("close") }}
        </v-btn>
      </v-card-actions>

      <!-- RENAME DIALOG ----------------------------------- -->
      <v-dialog v-model="rename_dialog" persistent>
        <v-card>
          <v-card-title>
            <v-card-title class="text-h4 font-weight-light">
              {{ $t("rename-screen") }}
            </v-card-title>
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-row flex-nowrap align-center">
              <v-img
                v-if="$store.state.print_displays[id]"
                :src="$store.state.print_displays[id] ?? ''"
                :max-width="200"
                :height="100"
                cover
                class="mx-3"
              />
              <v-text-field
                variant="underlined"
                :label="$t('message.put-name-screen')"
                v-model="name"
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" variant="text" @click="renameScreen()">
              {{ $t("save") }}
            </v-btn>
            <v-btn color="red" variant="text" @click="rename_dialog = false">
              {{ $t("close") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- ------------------------------------------------- -->

      <!-- BACKGROUND DIALOG ------------------------------- -->
      <v-dialog v-model="bg_dialog" persistent>
        <v-card>
          <v-card-title>
            <v-card-title class="text-h4 font-weight-light">
              {{ $t("format-screen-background") }}
            </v-card-title>
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-row flex-nowrap align-center">
              <v-color-picker
                v-model="color"
                mode="hexa"
                :swatches="$store.state.defauls.color_palette"
                show-swatches
                :swatches-max-height="100"
                :canvas-height="100"
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" variant="text" @click="formatScreen()">
              {{ $t("save") }}
            </v-btn>
            <v-btn color="red" variant="text" @click="bg_dialog = false">
              {{ $t("close") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- ------------------------------------------------- -->
    </v-card>
  </v-dialog>
</template>

<script>
const Screen = require("@/helpers/Screen.js");

export default {
  data() {
    return {
      model: null,
      rename_dialog: false,
      bg_dialog: false,
      id: null,
      name: "",
      color: "",
    };
  },
  computed: {
    screen: function () {
      return this.$store.state.screen;
    },
    show: function () {
      return this.$store.state.screen.show;
    },
    displays: function () {
      let d = {};
      let self = this;
      this.$store.state.displays.map((item) => {
        d[item.id] = item;
        d[item.id].name = d[item.id].label;
        let display = self.$store.state.data.screen[item.id];
        if (display.label && display.label != "") {
          d[item.id].label = display.label;
        }
        if (display.background) {
          d[item.id].background = display.background;
        }
        d[item.id].active = true;
      });
      Object.keys(this.$store.state.data.screen).filter((id) => {
        if (
          this.$store.state.displays.filter((item) => {
            return item.id == id;
          }) <= 0
        ) {
          d[id] = this.$store.state.data.screen[id];
          d[id].id = id;
          d[id].active = false;
        }
      });

      Object.keys(d).map((id) => {
        d[id].background = d[id].background ?? {};
        d[id].background.color = d[id].background.color ?? "#000000";
      });

      return d;
    },
  },
  watch: {
    show() {
      Screen.refresh();
    },
  },
  methods: {
    refreshScreen: function () {
      Screen.refresh();
    },
    closeScreen: function () {
      Screen.show();
    },
    lockScreen: function (id) {
      Screen.lock(id);
    },
    alwaysOnTopScreen: function (id) {
      Screen.always_on_top(id);
    },
    identifyMonitors: function (id) {
      Screen.identify();
    },
    renameScreenDialog(id, name) {
      this.id = id;
      this.name = name;
      this.rename_dialog = !this.rename_dialog;
    },
    renameScreen() {
      if (this.$store.state.data.screen[this.id]) {
        this.$store.state.data.screen[this.id].label = this.name;
      }
      this.rename_dialog = false;
      Screen.refresh();
    },
    deleteScreen(id) {
      Screen.remove(id);
    },
    formatScreenDialog(id, background) {
      this.id = id;
      this.color = background.color || "#000000";
      this.bg_dialog = !this.bg_dialog;
    },
    formatScreen() {
      if (this.$store.state.data.screen[this.id]) {
        this.$store.state.data.screen[this.id].background =
          this.$store.state.data.screen[this.id].background || {};

        this.$store.state.data.screen[this.id].background.color = this.color;
      }
      this.bg_dialog = false;
      Screen.refresh();
    },
  },
  mounted() {},
};
</script>