<template>
  <div class="d-flex" style="height: 100%; width: 100%">
    <!--
    <div class="d-flex" :style="styleBg">
      <span :style="styleTxt">
        {{ content.stopwatch | timer(data.stopwatch.mask) }}
      </span>
    </div>

    <v-expand-x-transition>
      <v-card
        transition="fab-transition"
        v-if="content.stopwatch_list.length > 0"
        style="overflow: auto"
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              Tempos Anotados
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item
            v-for="(item, index) in content.stopwatch_list"
            :key="index"
            link
          >
            <v-list-item-content>
              <v-list-item-title>
                <v-icon> mdi-av-timer </v-icon>
                <span class="ps-1" style="font-weight: bold"
                  >{{ index + 1 }}.</span
                >
                <span class="ps-3">
                  {{ item | timer(data.stopwatch.mask) }}
                </span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <div class="pa-3">
          <v-btn block color="error" @click="content.stopwatch_list = []">
            Limpar
          </v-btn>
        </div>
      </v-card>
    </v-expand-x-transition>
    -->
  </div>
</template>

<script>
/*
import filters from "@/filters";
export default {
  name: "stopwatch",
  filters,
  data() {
    return this.$root.$data;
  },
  computed: {
    styleBg: function () {
      return Object.assign(
        {
          height: "100%",
          overflow: "hidden",
          flex: "auto",
          alignItems: this.data.stopwatch.text.positionV,
          justifyContent: this.data.stopwatch.text.positionH,
          backgroundColor: this.data.stopwatch.bg.color,
          backgroundPosition: this.data.stopwatch.bg.position,
          backgroundSize: "cover",
          backgroundImage: this.data.stopwatch.bg.file.url
            ? `url(${this.data.stopwatch.bg.file.url})`
            : "initial",
        },
        this.data.stopwatch.bg.cssContent
          ? Object.fromEntries(
              this.data.stopwatch.bg.css
                .split(";")
                .filter((item) => item != "")
                .map((item) => {
                  return item.split(":");
                })
            )
          : {}
      );
    },
    styleTxt: function () {
      return Object.assign(
        {
          fontSize: `${this.data.stopwatch.text.fontSize}vh`,
          color: this.data.stopwatch.text.color,
        },
        this.data.stopwatch.text.cssContent
          ? Object.fromEntries(
              this.data.stopwatch.text.css
                .split(";")
                .filter((item) => item != "")
                .map((item) => {
                  return item.split(":");
                })
            )
          : {}
      );
    },
  },
};*/
</script>