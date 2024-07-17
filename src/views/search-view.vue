<script setup lang="ts">
import {
  BaseChipDropdown,
  BaseChipToggle,
  SearchField,
  CenterContainer,
  StationsList,
} from '@/components';
import { useAppStore } from '@/stores';
import { getFlagEmoji } from '@/utils';
import type { Codec } from 'radiobrowser-api-client';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface SortingOptionValue {
  order: 'name' | 'clickcount' | 'votes';
  reverse: boolean;
}

const i18n = useI18n();
const appStore = useAppStore();
const query = ref('');
const loadingFiltersError = ref(false);
const loadingFilters = ref(true);

const codecs = ref<Codec[] | null>(null);

const codec = ref(undefined);
const language = ref(undefined);
const country = ref(undefined);
const verified = ref(false);
const sortBy = ref<SortingOptionValue>({ order: 'name', reverse: false });

const codecOptions = computed(() =>
  codecs.value
    ? [
        { text: i18n.t('all'), value: undefined },
        ...codecs.value.map((codec) => ({
          text: codec.name,
          value: codec.name,
        })),
      ]
    : []
);
const languageOptions = computed(() => [
  { text: i18n.t('all'), value: undefined },
  ...appStore.languages.map((language) => ({
    text: language.name,
    value: language.name,
  })),
]);
const countryOptions = computed(() => [
  { text: i18n.t('all'), value: undefined },
  ...appStore.countries.map((country) => ({
    text: `${getFlagEmoji(
      country.code.toUpperCase()
    )} [${country.code.toUpperCase()}] ${country.name}`,
    value: country.code,
  })),
]);
const sortingOptions = computed(() => [
  {
    text: i18n.t('search.sortByName'),
    value: { order: 'name', reverse: false },
  },
  {
    text: i18n.t('search.sortByPopularity'),
    value: { order: 'clickcount', reverse: true },
  },
  {
    text: i18n.t('search.sortByVotes'),
    value: { order: 'votes', reverse: true },
  },
]);

async function loadFilters() {
  loadingFilters.value = true;
  loadingFiltersError.value = false;
  try {
    codecs.value = await appStore.apiClient.getCodecs({});
  } catch {
    loadingFiltersError.value = true;
  }
  loadingFilters.value = false;
}

onMounted(async () => await loadFilters());
</script>

<template>
  <div class="search-view">
    <div class="search__header" v-if="!loadingFilters && !loadingFiltersError">
      <search-field v-model="query" />
      <div class="chips__container">
        <base-chip-dropdown
          :label="$t('station.country')"
          v-model="country"
          :options="countryOptions"
          icon="language"
        />
        <base-chip-dropdown
          :label="$t('station.language')"
          v-model="language"
          :options="languageOptions"
          icon="translate"
        />
        <base-chip-dropdown
          :label="$t('station.codec')"
          v-model="codec"
          :options="codecOptions"
          icon="album"
        />
        <base-chip-toggle
          :text="$t('station.verified')"
          icon="verified"
          v-model="verified"
        />
        <base-chip-dropdown
          required
          v-model="sortBy"
          :options="sortingOptions"
          icon="swap_vert"
        />
      </div>
    </div>
    <stations-list
      :showMoreButton="true"
      noStationsIcon="search"
      :noStationsText="$t('noResults')"
      style="flex: 1"
      :params="{
        limit: 48,
        order: sortBy.order,
        reverse: sortBy.reverse,
        name: query,
        languageName: language,
        codec: codec,
        countryCode: country,
        languageExact: true,
        countryExact: true,
        hasExtendedInfo: verified ? true : undefined,
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
  height: 100%;
  .search__header {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
