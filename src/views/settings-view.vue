<script setup lang="ts">
import { BaseDropdown, CenterContainer } from '@/components';
import { useAppStore, usePlayerStore } from '@/stores';
import Languages from '@/translations/languages.json';
import { getFlagEmoji } from '@/utils';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import UsedAPIs from '@/assets/used-apis.json';

const appStore = useAppStore();
const playerStore = usePlayerStore();
const loadingCountriesError = ref(false);
const loadingCountries = ref(true);
const countries = ref<{ text: string; value: string }[] | null>(null);
const { exploreViewCountry } = storeToRefs(appStore);

async function loadCountries() {
  loadingCountries.value = true;
  loadingCountriesError.value = false;
  try {
    countries.value = (await appStore.apiClient.getCountries({})).map(
      (country) => ({
        text: `${getFlagEmoji(
          country.code.toUpperCase()
        )} [${country.code.toUpperCase()}] ${country.name}`,
        value: country.code,
      })
    );
  } catch {
    loadingCountriesError.value = true;
  }
  loadingCountries.value = false;
}

onMounted(async () => await loadCountries());
</script>

<template>
  <div class="settings" v-if="!loadingCountries && !loadingCountriesError">
    <p class="headline">{{ $t('nav.settings') }}</p>
    <section class="settings__form">
      <base-dropdown
        v-model="exploreViewCountry"
        :showOptionAll="true"
        :label="$t('settings.countryExploreView')"
        :options="countries!"
      />
      <base-dropdown
        v-model="appStore.language"
        :showOptionAll="false"
        :label="$t('settings.applicationLanguage')"
        :options="Languages"
      />
      <button class="block-button" @click="playerStore.clearHistory()">
        {{ $t('settings.clearHistory') }}
      </button>
      <div class="about">
        <div class="about__title">{{ $t('settings.about') }}</div>
        <div class="about__text">
          {{ $t('settings.apis') }}:
          <ul>
            <li v-for="(api, index) in UsedAPIs" :key="index">
              <a :href="api.homepage" target="_blank">
                {{ api.name }}
              </a>
            </li>
          </ul>
          <a href="https://github.com/web-radio/web-radio.github.io">GitHub</a>
          <div style="text-align: center">
            2023 - {{ new Date().getFullYear() }}
          </div>
        </div>
      </div>
    </section>
  </div>
  <center-container v-if="loadingCountries" type="loading" />
  <center-container
    v-if="loadingCountriesError"
    type="info"
    icon="error"
    :text="$t('error')"
    buttonIcon="refresh"
    @buttonClick="loadCountries"
  />
</template>

<style scoped lang="scss">
.settings {
  display: flex;
  flex-direction: column;
  .settings__form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    .about {
      padding: 15px;
      background: #ffffff04;
      border: 1px solid #ffffff10;
      font-size: 15px;
      border-radius: 7px;
      ul {
        margin: 10px 0;
        padding: 0 15px;
      }
      .about__title {
        font-size: 22px;
        font-weight: 600;
      }
      a {
        color: #fff;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
