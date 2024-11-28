<template>
  <div class="w-100 d-flex align-center">
    <v-btn
      color="primary"
      @click="reset()"
      :variant="input < 0 ? 'flat' : 'tonal'"
      density="compact"
      class="me-1"
    >
      {{ $t("components.letterpagination.all") }}
    </v-btn>

    <v-slide-group v-model="input" show-arrows center-active>
      <v-slide-group-item
        v-for="letter in letters"
        :key="letter"
        v-slot="{ isSelected, toggle }"
      >
        <v-btn
          icon
          color="primary"
          @click="toggle"
          :variant="isSelected ? 'flat' : 'tonal'"
          density="compact"
          class="me-1"
        >
          {{ letter }}
        </v-btn>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>

<script>
export default {
  name: "LetterPaginationComponent",
  props: {
    modelValue: String,
  },
  computed: {
    input: {
      get() {
        return this.letters.indexOf(this.modelValue);
      },
      set(value) {
        this.$emit("update:modelValue", this.letters[value] ?? "");
      },
    },
    letters() {
      return [
        "#",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
    },
  },
  methods: {
    reset() {
      this.input = -1;
    },
  },
};
</script>
