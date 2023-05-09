import { createI18n } from 'vue-i18n/dist/vue-i18n.esm-bundler.js';

const i18n = createI18n({
  locale: 'pt',
  messages: loadLocaleMessages(),
});

function loadLocaleMessages() {
  const locales = require.context('./lang', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default i18n;