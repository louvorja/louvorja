import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'

import { pt, es } from 'vuetify/locale'

const vuetify = createVuetify({
    components: {
        ...components,
        ...labsComponents,
    },
    directives,
    locale: {
        locale: 'pt',
        fallback: 'pt',
        messages: { pt, es }
    },
    defaults: {
        VTextField: {
            variant: "underlined",
        },
        VFileInput: {
            variant: "underlined",
        },
        VAutocomplete: {
            variant: "underlined",
        },
    },
})

export default vuetify;
