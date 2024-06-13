import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import App from '@/App.vue';
import router from '@/router';

import '@/assets/main.scss';
import 'leaflet/dist/leaflet.css';
import 'v-dropdown-menu/css';

import enTranslations from '@/translations/en.json';
import plTranslations from '@/translations/pl.json';
import { useAppStore } from '@/stores';

const app = createApp(App);

app.use(createPinia());
const appStore = useAppStore();
export const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  fallbackLocale: 'en',
  messages: {
    en: enTranslations,
    pl: plTranslations,
  },
});
app.use(i18n);
app.use(router);

app.mount('#app');
