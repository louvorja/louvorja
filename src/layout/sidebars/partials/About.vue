<template>
  <div>
    <div class="subtitle-1 py-2 font-weight-medium">{{ $t("developer") }}</div>
    <div class="text-caption">
      {{ data.author }}
    </div>
    <div class="text-caption">
      <v-icon icon="mdi mdi-email-outline" class="me-2" />
      <a class="link" :href="`mailto:${data.authorEmail}`">{{
        data.authorEmail
      }}</a>
    </div>

    <div class="py-2" />

    <div class="subtitle-1 py-2 font-weight-medium">
      {{ $t("about-the-program") }}
    </div>
    <div class="text-caption">
      <v-icon icon="mdi mdi-web" class="me-2" />
      <a class="link" :href="data.homepage">{{ data.homepage }}</a>
    </div>
    <div class="text-caption">
      <span class="text-bold">{{ $t("version") }}:</span> {{ data.version }}
    </div>
  </div>
</template>

<script>
import packageJson from "../../../../package.json";

export default {
  computed: {
    data: function () {
      return packageJson;
    },
  },
};
</script>