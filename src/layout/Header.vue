<template>
  <v-card :rounded="0" class="w-100">
    <v-tabs
      v-model="$store.state.active_header_tab"
      :theme="$store.state.data.layout.dark ? 'dark' : ''"
      :bg-color="$store.state.data.layout.color"
      class="text-white"
      center-active
      show-arrows
    >
      <v-tab
        v-for="item in items_tabs"
        :key="item.tab"
        :value="item.tab"
        :class="item.visible ? 'active_header_tab' : ''"
        :data-id="item.tab"
        style="font-size: 13px"
      >
        {{ $t(item.tab) }}
      </v-tab>
    </v-tabs>
    <v-window
      v-model="$store.state.active_header_tab"
      :theme="$store.state.data.layout.dark ? 'dark' : ''"
    >
      <v-window-item
        v-for="item in items_tabs"
        :key="item.tab"
        :value="item.tab"
      >
        <v-slide-group
          show-arrows
          :class="{ 'bg-dark': $store.state.data.layout.dark }"
        >
          <keep-alive :include="tabs">
            <transition>
              <component
                :is="item.component"
                v-show="item.component && item.visible == $route.name"
              />
            </transition>
          </keep-alive>
          <span v-if="typeof item.content === 'string'">
            {{ item.content }}
          </span>
          <template v-else>
            <v-card
              v-for="(group, index) in item.content"
              :key="index"
              :rounded="0"
              flat
              style="display: flex; flex-direction: row; flex-wrap: nowrap"
              :style="
                index > 0 ? 'border-left: 1px solid rgba(0,0,0,.12);' : ''
              "
              class="px-2"
            >
              <div v-for="(el, el_index) in group" :key="el_index">
                <l-button v-if="el.type === 'button'" :route="el.route" />
              </div>
            </v-card>
          </template>
        </v-slide-group>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<style scoped>
header .active_header_tab {
  background-color: rgba(0, 0, 0, 0.25);
}

.v-leave {
  opacity: 1;
}
.v-leave-active {
  transition: opacity 0.5s;
}
.v-leave-to {
  opacity: 0;
}

.bg-dark {
  background-color: #212121;
}
</style>

<script>
import { defineAsyncComponent } from "vue";

const System = require("../helpers/System.js");
const Locale = require("../helpers/Locale.js");
const Files = require("../helpers/Files.js");

export default {
  components: {
    lButton: defineAsyncComponent(() => import(`@/components/Button`)),
    stopwatch: defineAsyncComponent(() =>
      import(`@/layout/headertabs/StopwatchTab`)
    ),
    findmusic: defineAsyncComponent(() =>
      import(`@/layout/headertabs/FindMusicTab`)
    ),
    ico: defineAsyncComponent(() => import(`@/components/Icon`)),
  },
  data() {
    return {
      items: [
        {
          tab: "collections",
          content: [
            [{ type: "button", route: "hymnal" }],
            [{ type: "button", route: "collections" }],
            [{ type: "button", route: "find-musics" }],
          ],
        },
        {
          tab: "online-collections",
          content: [[{ type: "button", route: "online-videos" }]],
        },
        {
          tab: "bible",
          content: [[{ type: "button", route: "bible" }]],
        },
        /*{
          tab: "utilities",
          content: [
            [
              { type: "button", route: "liturgy" },
              { type: "button", route: "scheduled-items" },
            ],
            [
              { type: "button", route: "stopwatch" },
              { type: "button", route: "clock" },
              { type: "button", route: "worship-timer" },
            ],
            [{ type: "button", route: "sweepstake" }],
          ],
        },
        {
          tab: "stopwatch",
          visible: "stopwatch",
          component: "stopwatch",
        },
        {
          tab: "find-musics",
          visible: "find-musics",
          component: "findmusic",
        },*/
      ],
    };
  },
  computed: {
    items_tabs: function () {
      var self = this;
      return this.items.filter((item) => {
        return item.visible == undefined || item.visible == self.$route.name;
      });
    },
    sidebar: function () {
      return (
        Object.values(this.$store.state.sidebar).filter(function (key) {
          return key;
        }).length > 0
      );
    },
    tabs: function () {
      return this.$store.state.openpages.map((item) => {
        return item.name;
      });
    },
    debug: function () {
      return this.$store.state.debug;
    },
    lang: function () {
      return this.$store.state.data.lang;
    },
  },
  methods: {
    search: function () {
      alert("Busca em construção");
    },
    changeLocale: function (lang) {
      this.$store.state.lang = Locale.change(lang);
    },
    flag: function (lang) {
      return Locale.flag(lang);
    },
    maximize() {
      System.maximize();
    },
    minimize() {
      System.minimize();
    },
    close() {
      System.close();
    },
    img: function (dir) {
      return Files.img(dir);
    },
  },
};
</script>