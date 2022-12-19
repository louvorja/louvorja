import Vue from "vue";
const ShortKey = require('vue-shortkey')
Vue.use(ShortKey, { prevent: ['input', 'textarea'] })
export default ShortKey;