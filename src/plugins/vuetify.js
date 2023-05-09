import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { pt, es } from 'vuetify/locale'

const vuetify = createVuetify({
    components,
    directives,
    locale: {
        locale: 'pt',
        fallback: 'pt',
        messages: { pt, es }
    }
})

export default vuetify;
