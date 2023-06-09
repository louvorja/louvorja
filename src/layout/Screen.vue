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
              :color="display.active ? 'grey-lighten-3' : 'grey-lighten-5'"
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
                  v-if="display.label"
                  :style="
                    'font-weight: bold;' + (!display.active && 'opacity:.3;')
                  "
                >
                  {{ display.label }}
                </div>
                <div v-if="display.bounds" class="text-caption">
                  {{ display.bounds.width }}px x {{ display.bounds.height }}px
                </div>
                <div v-else class="text-red text-center">
                  <v-icon icon="mdi-monitor-off" /> {{ $t("no-signal") }}
                </div>
              </v-card-text>
              <v-card-actions class="ma-0 pa-1">
                <v-spacer></v-spacer>
                <v-btn
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
              </v-card-actions>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="ms-2"
          variant="flat"
          size="small"
          color="info"
          @click="refreshScreen()"
        >
          {{ $t("refresh-screens") }}
        </v-btn>
        <v-btn
          class="ms-2"
          variant="outlined"
          size="small"
          @click="closeScreen()"
        >
          {{ $t("close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const Screen = require("@/helpers/Screen.js");

export default {
  data() {
    return {
      model: null,
      //timer: null,
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
      this.$store.state.displays.map((item) => {
        d[item.id] = item;
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
      /*if (this.$store.state.screen.show) {
        this.timer = setInterval(function () {
          Screen.refresh();
        }, 10000);
      } else {
        clearInterval(this.timer);
      }*/
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
  },
  mounted() {},
};
</script>