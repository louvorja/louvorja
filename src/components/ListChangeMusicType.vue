<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      {{ukey}}
      <v-btn
        text
        small
        color="info"
        v-bind="attrs"
        v-on="on"
        v-if="audio === 1"
      >
        {{ $t("initials.sung") }}
      </v-btn>
      <v-btn
        text
        small
        color="success"
        v-bind="attrs"
        v-on="on"
        v-else-if="audio === 2"
      >
        {{ $t("initials.instrumental") }}
      </v-btn>
      <v-btn text small color="error" v-bind="attrs" v-on="on" v-else>
        {{ $t("initials.without-audio") }}
      </v-btn>
    </template>

    <v-list>
      <v-list-item-group :color="color">
        <v-list-item
          v-if="id_file_music"
          @click="$emit('sung')"
          :class="audio === 1 ? 'v-item--active v-list-item--active' : ''"
        >
          {{ $t("sung") }}
        </v-list-item>

        <v-list-item
          v-if="id_file_instrumental_music"
          @click="$emit('instrumental')"
          :class="audio === 2 ? 'v-item--active v-list-item--active' : ''"
        >
          {{ $t("instrumental") }}
        </v-list-item>

        <v-list-item
          v-if="type != 'player'"
          @click="$emit('without-audio')"
          :class="audio === 0 ? 'v-item--active v-list-item--active' : ''"
        >
          {{ $t("without-audio") }}
        </v-list-item>
      </v-list-item-group>

      <v-list-item @click="$emit('lyrics')">
        {{ $t("lyrics") }}
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<script>
export default {
  inheritAttrs: false,
  props: ["ukey","audio", "id_file_music", "id_file_instrumental_music", "type"],
  computed: {
    color: function () {
      return (this.audio === 1?"info":(this.audio === 2?"success":"error"));
    },
  }
};
</script>