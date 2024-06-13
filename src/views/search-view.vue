<script setup lang="ts">
import {
  BaseDropdown,
  BaseTextField,
  CenterContainer,
  StationsList,
} from '@/components';
import { useAppStore } from '@/stores';
import { getFlagEmoji } from '@/utils';
import { onMounted, ref } from 'vue';

const appStore = useAppStore();
const query = ref('');
const loadingFiltersError = ref(false);
const loadingFilters = ref(true);
const codecs = ref<null | { text: string; value: string }[]>(null);
const languages = ref<null | { text: string; value: string }[]>(null);
const countries = ref<null | { text: string; value: string }[]>(null);
const codec = ref('all');
const language = ref('all');
const country = ref('all');

async function loadFilters() {
  loadingFilters.value = true;
  loadingFiltersError.value = false;
  try {
    codecs.value = (await appStore.apiClient.getCodecs({})).map((codec) => ({
      text: codec.name,
      value: codec.name,
    }));
    languages.value = (await appStore.apiClient.getLanguages({})).map(
      (language) => ({ text: language.name, value: language.name })
    );
    countries.value = (await appStore.apiClient.getCountries({})).map(
      (country) => ({
        text: `${getFlagEmoji(
          country.code.toUpperCase()
        )} [${country.code.toUpperCase()}] ${country.name}`,
        value: country.code,
      })
    );
  } catch {
    loadingFiltersError.value = true;
  }
  loadingFilters.value = false;
}

onMounted(async () => await loadFilters());
</script>

<template>
  <div class="search-view">
    <div class="form" v-if="!loadingFilters && !loadingFiltersError">
      <div class="form__fields">
        <base-text-field v-model="query" :label="$t('station.name')" />
        <div class="form__details">
          <base-dropdown
            v-model="country"
            :showOptionAll="true"
            :label="$t('station.country')"
            :options="countries!"
          />
          <base-dropdown
            v-model="language"
            :showOptionAll="true"
            :label="$t('station.language')"
            :options="languages!"
          />
          <base-dropdown
            v-model="codec"
            :showOptionAll="true"
            :label="$t('station.codec')"
            :options="codecs!"
          />
        </div>
      </div>
    </div>
    <stations-list
      :showMoreButton="true"
      noStationsIcon="search"
      :noStationsText="$t('noResults')"
      style="height: max-content"
      :params="{
        limit: 48,
        order: query ? 'name' : 'clickcount',
        reverse: query === '',
        name: query,
        languageName: language === 'all' ? undefined : language,
        codec: codec === 'all' ? undefined : codec,
        countryCode: country === 'all' ? undefined : country,
        languageExact: true,
        countryExact: true,
      }"
      v-if="!loadingFilters && !loadingFiltersError"
    />
    <center-container v-if="loadingFilters" type="loading" />
    <center-container
      v-if="loadingFiltersError"
      type="info"
      icon="error"
      :text="$t('error')"
      buttonIcon="refresh"
      @buttonClick="loadFilters"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-view {
  display: flex;
  flex-direction: column;
  gap: 40px;
  height: 100%;
  .form {
    display: flex;
    .form__fields {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      .form__details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        grid-gap: 10px;
      }
    }
  }
}
</style>
