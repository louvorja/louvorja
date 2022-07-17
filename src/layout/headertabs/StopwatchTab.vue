<template>
  <v-item-group class="v-btn-toggle">
    <span>
      <l-button
        icon="play"
        label="Iniciar"
        @click.native="fn_start()"
        v-if="!start"
      />
    </span>
    <span>
      <l-button
        icon="pause"
        label="Pausar"
        @click.native="fn_pause()"
        v-if="start"
      />
    </span>
    <span>
      <l-button
        icon="stop"
        label="Zerar"
        @click.native="fn_stop()"
        :disabled="!start && !pause"
      />
    </span>
    <v-divider class="mx-4" vertical></v-divider>
    <span>
      <l-button
        icon="money-check-pen"
        label="Anotar tempo"
        @click.native.prevent="fn_anotar()"
      />
    </span>
    <v-divider class="mx-4" vertical></v-divider>
    <span>
      <l-button
        icon="pencil"
        label="Formatar"
        @click.native="$root.sidebar.stopwatch = !$root.sidebar.stopwatch"
      />
    </span>
  </v-item-group>
</template>


<script>
export default {
  components: {
    lButton: () => import(`@/components/Button`),
  },
  data() {
    return {
      refresh: 0,
      start: false,
      pause: false,
      start_time: 0,
      interval: null,
    };
  },
  mounted() {},
  watch: {
    start() {
      console.log("start ", this.start);
      var self = this;

      if (this.start) {
        self.$root.tabs_dot.push("stopwatch");
        if (this.interval != null) {
          clearInterval(this.interval);
        }
        this.interval = setInterval(function () {
          if (!self.start) {
            return false;
          }
          var dh_a = new Date();
          var dh_i = self.start_time;
          self.$root.content.stopwatch = dh_a - dh_i;
        }, 1);
      } else {
        self.$root.tabs_dot.splice("stopwatch");
        clearInterval(this.interval);
        this.interval = null;
      }
    },
  },
  methods: {
    fn_start: function () {
      if (this.pause == true) {
        var dh = new Date();
        this.start_time = dh - this.$root.content.stopwatch;
        this.start = true;
        this.pause == false;
      } else if (this.start !== true) {
        this.start_time = new Date();
        this.start = true;
      }
    },
    fn_pause: function () {
      this.start = false;
      this.pause = true;
    },
    fn_stop: function () {
      this.start = false;
      this.pause = false;
      this.$root.content.stopwatch = 0;
    },
    fn_anotar: function () {
      this.$root.content.stopwatch_list.push(this.$root.content.stopwatch);
    },
    fn_apagar: function () {
      this.$fire({
        text: "Deseja apagar todos os tempos anotados?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
      }).then((r) => {
        if (r.value == true) {
          self.list = [];
        }
      });
    },
  },
  created() {
    this.$root.content.stopwatch = 0;
  },
  beforeDestroy() {
    this.$root.content.stopwatch = 0;
  },
};
</script>