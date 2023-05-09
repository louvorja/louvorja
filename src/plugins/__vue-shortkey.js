import { createApp } from 'vue';
const ShortKey = require('vue3-shortkey')

const app = createApp({});
app.use(ShortKey, { prevent: ["input", "textarea"] });
export default app;