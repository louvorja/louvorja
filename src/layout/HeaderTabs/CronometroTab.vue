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
        @click.native="$root.sidebar.cronometro = !$root.sidebar.cronometro"
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
        self.$root.tabs_dot.push("cronometro");
        if (this.interval != null) {
          clearInterval(this.interval);
        }
        this.interval = setInterval(function () {
          if (!self.start) {
            return false;
          }
          var dh_a = new Date();
          var dh_i = self.start_time;
          self.$root.content.cronometro = dh_a - dh_i;
        }, 1);
      } else {
        self.$root.tabs_dot.splice("cronometro");
        clearInterval(this.interval);
        this.interval = null;
      }
    },
  },
  methods: {
    fn_start: function () {
      if (this.pause == true) {
        var dh = new Date();
        this.start_time = dh - this.$root.content.cronometro;
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
      this.$root.content.cronometro = 0;
    },
    fn_anotar: function () {
      this.$root.content.cronometro_list.push(this.$root.content.cronometro);
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
    this.$root.content.cronometro = 0;
  },
  beforeDestroy() {
    this.$root.content.cronometro = 0;
  },
};
</script>