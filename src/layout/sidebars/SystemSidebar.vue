<template>
  <v-navigation-drawer
    v-model="$store.state.sidebar.geral"
    absolute
    location="left"
    temporary
    :width="width"
    :theme="$store.state.data.layout.dark ? 'dark' : ''"
  >
    <div class="d-flex flex-row">
      <v-tabs
        direction="vertical"
        v-model="active_menu"
        :color="
          !$store.state.data.layout.dark ? $store.state.data.layout.color : ''
        "
        :style="`width:${width_menu_min}px`"
      >
        <v-tab
          v-for="tab in menu_list"
          :key="tab.name"
          :value="tab.name"
          @click="action(tab)"
        >
          <v-icon start> {{ tab.icon }} </v-icon>
          <span style="font-size: 12px">{{ $t(tab.name) }}</span>
        </v-tab>
      </v-tabs>

      <v-window
        v-model="active_menu"
        :style="`width:${width - width_menu_min}px`"
      >
        <v-window-item
          v-for="tab in menu_list"
          :key="tab.name"
          :value="tab.name"
        >
          <v-card flat>
            <v-card-title class="minus-systemsidebar-height">{{
              $t(tab.name)
            }}</v-card-title>
            <v-divider class="my-2 minus-systemsidebar-height"></v-divider>
            <v-card-text
              :style="
                'height:' +
                content_height +
                'px;overflow: hidden;overflow-y: auto;'
              "
            >
              <component v-if="tab.component" :is="tab.component" />
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  components: {
    about: defineAsyncComponent(() => import(`./partials/About`)),
    config: defineAsyncComponent(() => import(`./partials/Config`)),
    themes: defineAsyncComponent(() => import(`./partials/Themes`)),
    database: defineAsyncComponent(() => import(`./partials/DataBase`)),
  },
  data() {
    return {
      active_menu: "configs",
      width_menu_min: 220,
      width_menu_open: 580,
      menu: [
        {
          name: "configs",
          icon: "mdi-account",
          component: "config",
          //width: 95,
        },
        {
          name: "skin",
          icon: "mdi-palette",
          component: "themes",
        },
        {
          name: "streaming",
          icon: "mdi-access-point",
          component: "themes",
          desktop: true,
        },
        {
          name: "screens",
          icon: "mdi-monitor-multiple",
          click: "this.screens()",
          desktop: true,
        },
        {
          name: "download-center",
          icon: "mdi-briefcase-download",
          click: "this.store()",
          desktop: true,
        },
        {
          name: "database",
          icon: "mdi-database",
          component: "database",
          desktop: true,
        },
        {
          name: "about",
          icon: "mdi-information",
          component: "about",
        },
      ],
    };
  },
  computed: {
    width: function () {
      let menu = this.menu.find((item) => item.name === this.active_menu);
      return this.active_menu && menu && menu.component
        ? menu.width || this.width_menu_open
        : this.width_menu_min;
    },
    desktop: function () {
      return this.$store.state.desktop;
    },
    menu_list: function (id_categoria) {
      return this.desktop
        ? this.menu
        : this.menu.filter((menu) => !menu.desktop);
    },
    content_height: function () {
      //this.refresh;
      let height = this.$store.state.window.main.height - 65;
      document.querySelectorAll(".minus-systemsidebar-height").forEach((el) => {
        height -= el.offsetHeight || 0;
      });
      return height;
    },
  },
  methods: {
    action: function (item) {
      if (item.click) {
        var self = this;
        setTimeout(() => {
          self.active_menu = 0;
        }, 100);
        this.$store.state.sidebar.geral = false;
        eval(item.click);
      }
    },
    store: function () {
      this.$store.state.store.show = true;
    },
    screens: function () {
      this.$store.state.screen.show = true;
    },
  },
};
</script>