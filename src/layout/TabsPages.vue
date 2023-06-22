<template>
  <v-slide-group
    show-arrows
    class="pt-1 tabs"
    :class="{
      dark: $store.state.data.layout.dark,
      line: $store.state.page != 'home',
    }"
  >
    <draggable
      class="draggable"
      v-model="$store.state.openpages"
      :key="$store.state.openpages.length"
    >
      <template v-slot:item="{ item }">
        <v-card
          :to="item.name"
          class="tab pointer"
          :class="item.name == $store.state.page ? 'active' : 'inactive'"
          :style="{ marginLeft: '2px', textDecoration: 'none' }"
          :variant="item.name == $store.state.page ? 'outlined' : 'plain'"
        >
          <template v-slot:prepend>
            <ico :src="item.icon" size="16" />
          </template>
          <template v-slot:append>
            <v-btn
              size="small"
              :style="
                $store.state.data.layout.dark
                  ? 'color: #FFFFFF !important'
                  : 'color: #000000 !important'
              "
              variant="plain"
              icon="mdi-close"
              class="text-white"
              @click.prevent="closeTab(item.name)"
            />
          </template>
          <template v-slot:title>
            <span class="text-button" style="font-size: 10px !important">
              {{ $t(item.name) }}
            </span>
          </template>
        </v-card>
      </template>
    </draggable>
  </v-slide-group>
</template>

<style scoped>
.draggable {
  display: flex;
  flex-wrap: nowrap;
}
.inactive {
  background-color: #e5e5e5;
}
.tabs {
  position: relative;
}
.tabs.line::before {
  content: "" !important;
  position: absolute !important;
  width: 100% !important;
  height: 1px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.87) !important;
  left: 0 !important;
  bottom: 0 !important;
}
.tabs .active {
  border-bottom: 1px #fff solid !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.tabs.dark {
  background-color: #212121 !important;
}
.tabs.dark .active {
  color: #fff !important;
  background-color: #373737 !important;
}
.tabs.dark .inactive {
  color: #fff !important;
  background-color: #373737 !important;
}
.tabs.dark .active,
.tabs.line.dark::before {
  border-color: #777 !important;
}
.tabs.dark .inactive {
  border-bottom: 1px #777 solid !important;
}
</style>
<style>
.tab .v-card-item {
  height: 20px !important;
  display: flex !important;
}
</style>

<script>
import { defineAsyncComponent } from "vue";
import Draggable from "vue3-draggable";
const DevTools = require("@/helpers/DevTools.js");
const Storage = require("@/helpers/Storage.js");

export default {
  data() {
    return {};
  },
  components: {
    Draggable,
    ico: defineAsyncComponent(() => import(`@/components/Icon`)),
  },

  methods: {
    closeTab: function (page) {
      /*if (this.tabs_dot.indexOf(page) >= 0) {
        this.dialog.show = true;
        this.dialog.title = $t("task-in-progress");
        this.dialog.text = $t("message.task-in-progress") + ".";
        this.dialog.buttons = [{ text: "Ok", value: "ok" }];
        this.dialog.value = "";
        return;
      }*/
      DevTools.write("close:", page);
      Storage.removeAll(page);

      let open = false;
      this.show_arrows = false;
      if (this.$route.name == page) {
        open = true;
      }
      this.$store.state.openpages = this.$store.state.openpages.filter(
        (element) => element.name !== page
      );
      if (open) {
        if (this.$store.state.openpages.length <= 0) {
          this.$router.push("/");
        } else {
          var r = this.$store.state.openpages[0];
          this.$router.push(r.path);
        }
      }
    },
  },
};
</script>