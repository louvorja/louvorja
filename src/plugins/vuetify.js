import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

// Translation provided by Vuetify (javascript)
import pt from 'vuetify/lib/locale/pt'
import es from 'vuetify/lib/locale/es'

export default new Vuetify({
    lang: {
        locales: { pt, es },
        current: 'pt',
    },
})