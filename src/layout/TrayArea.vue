<template>
  <div
    class="apps-bar d-flex flex-column"
    v-if="Object.keys(modules).length > 0"
  >
    <div class="apps-bar-header"></div>

    <draggable
      v-model="modules"
      item-key="id"
      class="apps-bar-container d-flex align-center justify-center flex-column"
    >
      <!---->
      <template #item="{ element }">
        <v-btn
          :color="$theme.primary()"
          style="margin: 3px 0 3px 0"
          tonal
          icon
          @click="$modules.open(element.id)"
        >
          <v-icon :icon="element.icon"></v-icon>
          <v-tooltip activator="parent" location="start">
            {{ $t(element.title) }}
          </v-tooltip>
        </v-btn>
      </template>
    </draggable>

    <div class="apps-bar-footer"></div>
  </div>
</template>

<script>
import Draggable from "vuedraggable";

export default {
  name: "TrayAreaLayout",
  components: {
    Draggable,
  },
  computed: {
    modules: {
      get() {
        return Object.values(this.$modules.getTray());
      },
      set(value) {
        this.$modules.setTray(value.map((module) => module.id));
      },
    },
  },
};
</script>

<style scoped>
.apps-bar {
  width: 80px;
  margin: 5px;
}
.apps-bar-header,
.apps-bar-footer {
  flex: 0;
}
.apps-bar-container {
  flex: auto;
  overflow: auto;
  background-color: rgba(var(--v-theme-primary), 0.2) !important;
  border-radius: 15px;
}

.sortable-ghost {
  background-color: rgba(var(--v-theme-primary), 0.3) !important;
}
</style>
