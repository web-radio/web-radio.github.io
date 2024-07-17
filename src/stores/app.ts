import { formatLanguage } from '@/utils';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { Country, Language, RadioBrowserClient } from 'radiobrowser-api-client';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const apiClient = new RadioBrowserClient('web-radio.github.io', '0.1.0');

  const exploreViewCountry = useStorage<string>('exploreViewCountry', 'auto');
  function setExploreViewCountry(country: string) {
    exploreViewCountry.value = country;
  }
  const exploreViewLanguage = useStorage<string>('exploreViewLanguage', 'all');

  const language = useStorage<string>(
    'language',
    formatLanguage(navigator.language)
  );

  const fullscreen = ref(false);
  function toggleFullscreen() {
    const fulscreenElement = document.querySelector('.player-bar-fullscreen')!;
    if (!fulscreenElement.onfullscreenchange) {
      fulscreenElement.onfullscreenchange = () => {
        fullscreen.value = !fullscreen.value;
      };
    }
    if (!document.fullscreenElement?.className) {
      fulscreenElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  const countries = ref<Country[]>([]);
  function setCountries(newValue: Country[]) {
    countries.value = newValue;
  }

  const languages = ref<Language[]>([]);
  function setLanguages(newValue: Language[]) {
    languages.value = newValue;
  }

  return {
    exploreViewCountry,
    setExploreViewCountry,
    exploreViewLanguage,
    language,
    apiClient,
    fullscreen,
    toggleFullscreen,
    countries,
    setCountries,
    languages,
    setLanguages,
  };
});
