<template>
  <v-col :cols="col">
    <v-subheader
      v-if="type == 'slider' || type == 'range-slider' || type == 'color'"
    >
      {{ label }}
    </v-subheader>
    <v-slider
      v-if="type == 'slider'"
      v-bind="$attrs"
      :value="value"
      @change="updateValue($event)"
      append-icon="mdi-plus"
      prepend-icon="mdi-minus"
      @click:prepend="updateValue(value - 1)"
      @click:append="updateValue(value + 1)"
      hide-details="auto"
      thumb-label="always"
      :thumb-size="20"
    >
    </v-slider>
    <v-range-slider
      v-else-if="type == 'range-slider'"
      v-bind="$attrs"
      :value="valueMarks"
      @change="updateValue(updateMarks($event))"
      :min="0"
      :max="Object.keys(marks).length - 1"
      :tick-labels="Object.values(marks)"
      ticks="always"
      tick-size="4"
      hide-details="auto"
    >
    </v-range-slider>
    <v-color-picker
      v-else-if="type == 'color'"
      v-bind="$attrs"
      :value="value"
      @update:color="updateValue($event.hexa)"
      :label="label"
      dot-size="25"
      swatches-max-height="200"
      canvas-height="50"
      dotSize="10"
      hide-mode-switch
      mode="hexa"
      hide-details="auto"
    >
    </v-color-picker>
    <v-select
      v-else-if="type == 'select'"
      v-bind="$attrs"
      :value="value"
      :items="selectOptions"
      @change="updateValue($event)"
      :label="label"
      outlined
      hide-details="auto"
    >
    </v-select>
    <v-switch
      v-else-if="type == 'checkbox'"
      v-bind="$attrs"
      :input-value="value"
      @change="updateValue($event)"
      :label="label"
      hide-details="auto"
    >
    </v-switch>
    <v-textarea
      v-else-if="type == 'textarea'"
      v-bind="$attrs"
      :value="value"
      @input.native="updateValue($event.target.value)"
      :label="label"
      hide-details="auto"
      rows="1"
      auto-grow
      outlined
    >
    </v-textarea>
    <div v-else-if="type == 'file'">
      <div v-if="value.url">
        <v-subheader>
          {{ label }}
        </v-subheader>
        <v-img max-height="150" :src="value.url"></v-img>
        <v-row align="center" justify="end" class="mt-3">
          <v-btn rounded color="error" small text @click="removeFile">
            <v-icon> mdi-image-remove </v-icon>
            Remover Imagem
          </v-btn>
        </v-row>
      </div>
      <v-file-input
        v-else-if="$root.$data.desktop"
        v-bind="$attrs"
        :value="value"
        @input.native="setFile($event)"
        :label="label"
        hide-details="auto"
        prepend-icon="mdi-image-outline"
        outlined
      >
      </v-file-input>
      <div v-else>
        <v-text-field
          v-bind="$attrs"
          ref="theSelect"
          :label="label"
          v-model="fileinputvalue"
          hide-details="auto"
          outlined
          append-outer-icon="mdi-image-plus"
          @click:append-outer="addFileUrl(fileinputvalue)"
        ></v-text-field>
      </div>
    </div>
    <v-text-field
      v-else
      v-bind="$attrs"
      :value="value"
      @input.native="updateValue($event.target.value)"
      :label="label"
      hide-details="auto"
      outlined
    >
    </v-text-field>
  </v-col>
</template>


<script>
export default {
  inheritAttrs: false,
  props: [
    "label",
    "type",
    "value",
    "options",
    "optionsList",
    "data",
    "marks",
    "col",
  ],
  data() {
    return {
      fileinputvalue: "",
    };
  },
  computed: {
    selectOptions: function () {
      if (this.optionsList == "position") {
        return [
          { value: "center top", text: "Superior" },
          { value: "left top", text: "Superior Esquerdo" },
          { value: "right top", text: "Superior Direito" },
          { value: "left center", text: "Esquerdo" },
          { value: "center center", text: "Centro" },
          { value: "right center", text: "Direito" },
          { value: "left bottom", text: "Inferior Esquerdo" },
          { value: "center bottom", text: "Inferior" },
          { value: "right bottom", text: "Inferior Direito" },
        ];
      } else if (this.optionsList == "positionV") {
        return [
          { value: "start", text: "Superior" },
          { value: "center", text: "Centro" },
          { value: "end", text: "Inferior" },
        ];
      } else if (this.optionsList == "positionH") {
        return [
          { value: "start", text: "Esquerdo" },
          { value: "center", text: "Centro" },
          { value: "end", text: "Direito" },
        ];
      } else if (this.options) {
        return this.options;
      } else {
        return [];
      }
    },
    valueMarks: function () {
      var self = this;
      var v = [];
      Object.keys(this.marks).filter(function (key, index) {
        if (self.value.find((element) => element == key) == key) v.push(index);
      });
      if (v.length <= 1) {
        v.push(v[0]);
      }
      return v;
    },
  },
  methods: {
    updateValue: function (value) {
      //console.log(value);
      this.$emit("input", value);
    },
    updateMarks: function ($event) {
      var v = Object.keys(this.marks).filter(function (key, index) {
        return $event.find((element) => element == index) >= 0;
      });
      if (v.length <= 1) {
        v.push(v[0]);
      }
      return v;
    },
    setFile($e) {
      console.log($e.target.files[0]);
      this.$emit("input", {
        url: "file:///" + $e.target.files[0].path.replace(/\\/g, "/"),
        path: $e.target.files[0].path,
        name: $e.target.files[0].name,
        type: $e.target.files[0].type,
        size: $e.target.files[0].size,
      });
    },
    addFileUrl($e) {
      var vl = $e;
      this.fileinputvalue = "";
      this.$emit("input", {
        url: $e,
      });
    },
    removeFile() {
      this.$emit("input", { url: "" });
    },
  },
};
</script>