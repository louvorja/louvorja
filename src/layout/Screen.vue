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
              :color="
                display.active
                  ? $store.state.active_displays[display.id]
                    ? 'amber-lighten-3'
                    : 'grey-lighten-3'
                  : 'grey-lighten-5'
              "
            >
              <img
                v-if="$store.state.print_displays[display.id]"
                :src="$store.state.print_displays[display.id] ?? ''"
                :style="'height: 100px;' + (!display.active && 'opacity:.5;')"
              />
              <div
                v-else
                style="width: 180px; height: 100px; background: #c7c2c2"
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
              </v-card-text>
              <v-card-actions class="ma-0 pa-1">
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

      <v-dialog v-model="rename_dialog" persistent width="1024">
        <v-card>
          <v-card-title>
            <v-card-title class="text-h4 font-weight-light">
              {{ $t("rename-screen") }}
            </v-card-title>
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-row flex-nowrap align-center">
              <img
                v-if="$store.state.print_displays[id]"
                :src="$store.state.print_displays[id] ?? ''"
                style="height: 100px"
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
      id: null,
      name: "",
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
      console.log(id, name);
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
  },
  mounted() {},
};
</script>