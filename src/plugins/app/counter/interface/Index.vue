<template>
  <l-window
    v-model="module.show"
    :title="$t(module.title)"
    :icon="module.icon"
    closable
    minimizable
    @close="$modules.close(module_id)"
    @minimize="$modules.minimize(module_id)"
  >
    <template v-slot:header>
      <v-tabs v-model="tab" align-tabs="center" :color="$theme.primary()">
        <v-tab :value="1">Basic Counter</v-tab>
        <v-tab :value="2">Advanced Counter</v-tab>
        <v-tab :value="3">Counter History</v-tab>
      </v-tabs>
    </template>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <v-container fluid>
          <div class="d-flex flex-column align-center justify-center pa-6">
            <h2 class="text-h4 mb-4">Simple Counter</h2>
            <div class="d-flex align-center">
              <v-btn 
                icon="mdi-minus" 
                variant="outlined" 
                @click="decrement"
              ></v-btn>
              <div class="text-h3 mx-4">{{ count }}</div>
              <v-btn 
                icon="mdi-plus" 
                variant="outlined" 
                @click="increment"
              ></v-btn>
            </div>
            <v-btn 
              class="mt-4" 
              color="primary" 
              @click="reset"
            >
              Reset
            </v-btn>
          </div>
        </v-container>
      </v-tabs-window-item>

      <v-tabs-window-item :value="2">
        <v-container fluid>
          <div class="d-flex flex-column align-center justify-center pa-6">
            <h2 class="text-h4 mb-4">Advanced Counter</h2>
            <div class="d-flex align-center">
              <v-text-field
                v-model.number="step"
                label="Increment Step"
                type="number"
                variant="outlined"
                class="mr-4"
                style="width: 120px;"
              ></v-text-field>
              <v-btn 
                icon="mdi-minus" 
                variant="outlined" 
                @click="decrementBy(step)"
              ></v-btn>
              <div class="text-h3 mx-4">{{ count }}</div>
              <v-btn 
                icon="mdi-plus" 
                variant="outlined" 
                @click="incrementBy(step)"
              ></v-btn>
            </div>
            <v-btn 
              class="mt-4" 
              color="primary" 
              @click="reset"
            >
              Reset
            </v-btn>
          </div>
        </v-container>
      </v-tabs-window-item>

      <v-tabs-window-item :value="3">
        <v-container fluid>
          <v-list>
            <v-list-item 
              v-for="(value, index) in history" 
              :key="index"
              :title="`Change ${index + 1}`"
              :subtitle="value > 0 ? `+${value}` : value"
            >
              <template v-slot:prepend>
                <v-icon 
                  :color="value > 0 ? 'green' : 'red'"
                  :icon="value > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"
                ></v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </l-window>
</template>

<script>
import LWindow from "@/components/Window.vue";

export default {
  name: "CounterModule",
  components: {
    LWindow
  },
  data: () => ({
    module_id: "counter",
    tab: 1,
    count: 0,
    step: 1,
    history: []
  }),
  computed: {
    module() {
      return this.$modules.get(this.module_id);
    }
  },
  methods: {
    increment() {
      this.count++;
      this.history.unshift(1);
    },
    decrement() {
      this.count--;
      this.history.unshift(-1);
    },
    incrementBy(value) {
      this.count += value;
      this.history.unshift(value);
    },
    decrementBy(value) {
      this.count -= value;
      this.history.unshift(-value);
    },
    reset() {
      this.count = 0;
      this.history = [];
    }
  }
}
</script>