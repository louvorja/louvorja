<template>
  <div class="d-flex flex-column" style="height: 100%">
    <div class="pa-3">
      <l-input
        type="text"
        v-model="search"
        label="Digite o nome ou número do hino"
        append-icon="mdi-magnify"
      />
    </div>
    <div class="pa-3" style="height: 100%; max-height: 100%; overflow: auto">
      <v-data-table
        :headers="fields"
        :items="hinos"
        :items-per-page="-1"
        :search="search"
        :custom-filter="filterPerfectMatch"
        :loading="carregando"
        :disable-pagination="true"
        no-data-text="Não há dados para serem exibidos"
        no-results-text="Nenhum resultado encontrado"
        loading-text="Carregando..."
        dense
      >
      <template v-slot:[`item.opcoes`]="{ item }">
        {{item}}
      </template>      
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "hinario",
  components: {
    lInput: () => import(`@/components/Input`),
  },
  data() {
    return {
      search: null,
      carregando: true,
      hinos: [],
      fields: [
        {
          text: "Número",
          value: "faixa",
          align: "end",
        },
        { text: "Titulo", value: "titulo" },
        { text: "", value: "opcoes" },
      ],
    };
  },
  methods: {
    filterPerfectMatch(value, search) {
      if (isNaN(search)) {
        if (isNaN(value)){
          return value.toLowerCase().indexOf(search.toLowerCase()) > -1;
        }else{
          return false;
        }
      } else {
        return value != null && value == search;
      }
    },
  },
  created() {
    console.log("CREATED");
  },
  destroyed() {
    console.log("DESTROY");
  },
  mounted: async function () {
    console.log("MOUNTED", this.hinos.length);
    let data = await this.$root.getData("hinario");
    this.hinos = data;
    this.carregando = false;
  },
};
</script>