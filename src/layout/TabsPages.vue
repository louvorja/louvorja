<template>
  <v-slide-group :show-arrows="show_arrows" class="mt-1 tabs">
    <draggable class="draggable" v-model="openpages">
      <transition-group
        class="transition-group"
        type="transition"
        name="flip-list"
      >
        <v-btn
          v-for="pg in openpages"
          depressed
          :key="pg.name"
          :active="pg.name == page"
          :outlined="pg.name == page"
          :plain="pg.name == page"
          :data-page="pg.name"
          :to="pg.name"
          x-small
          style="
            margin-left: 3px;
            margin-top: 3px;
            padding-top: 3px;
            padding-bottom: 3px;
          "
        >
          <ico :src="pg.icon" size="16" />
          <span class="ml-2 mr-2">{{ pg.title }}</span>
          <span v-if="tabs_dot.indexOf(pg.name) >= 0">
            <v-badge dot color="red"></v-badge>
          </span>
          <v-btn icon href="#" @click.prevent="closeTab(pg.name)" class="ml-2">
            <v-icon x-small>mdi-close</v-icon>
          </v-btn>
        </v-btn>
      </transition-group>
    </draggable>
  </v-slide-group>
</template>

<style scoped>
.tabs:before {
  content: "" !important;
  position: absolute !important;
  width: 100% !important;
  height: 1px !important;
  top: 23px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.87) !important;
  left: 0 !important;
}
.tabs .v-btn--active {
  margin-top: 4px !important;
  border-bottom: 1px #fff solid !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.draggable,
.transition-group {
  width: 100% !important;
  display: flex !important;
}
</style>

<script>
import $ from "jquery";
import draggable from "vuedraggable";

export default {
  data() {
    return this.$root.$data;
  },
  components: {
    ico: () => import(`@/components/Icone`),
    draggable,
  },
  methods: {
    closeTab: function (page) {
      if (this.tabs_dot.indexOf(page) >= 0){
      this.dialog.show = true;
      this.dialog.title = "Tarefa em andamento";
      this.dialog.text = "Existe uma tarefa em andamento nesta aba! Encerre a tarefa primeiro.";
      this.dialog.buttons = [{ text: "Ok", value: "ok" }];
      this.dialog.value = '';
        return;
      }
      var open = false;
      this.show_arrows = false;
      if (this.$route.name == page) {
        open = true;
      }
      this.$root.openpages = this.$root.openpages.filter(
        (element) => element.name !== page
      );
      if (open) {
        if (this.$root.openpages.length <= 0) {
          this.$router.push("/");
        } else {
          var r = $(this.$root.openpages).get(0);
          this.$router.push(r.path);
        }
      }
    },
  },
  watch: {
    openpages: {
      handler: function () {
        this.$session.set("openpages",this.openpages);
      },
      deep: true
    },
  },
  mounted() {
    if (this.$session.get("openpages") !== undefined){
      this.openpages = this.$session.get("openpages");
    }
  }
  /*beforeRouteUpdate(to, from, next){
  console.log(to, from);
  next();
},*/
};
</script>