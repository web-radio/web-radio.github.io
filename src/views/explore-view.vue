<script setup lang="ts">
import { StationsList, BaseChipDropdown } from '@/components';
import { useAppStore, usePlayerStore } from '@/stores';
import { getFlagEmoji } from '@/utils';
import { storeToRefs } from 'pinia';
import type { ISearchStation } from 'radiobrowser-api-client';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Section {
  name: string;
  params: ISearchStation;
}

const appStore = useAppStore();
const playerStore = usePlayerStore();
const i18n = useI18n();
const sections = ref<Section[]>([
  {
    name: 'exploreViewSections.mostPopular',
    params: { order: 'clickcount', reverse: true },
  },
  {
    name: 'exploreViewSections.gainingPopularity',
    params: { order: 'clicktrend', reverse: true },
  },
  {
    name: 'exploreViewSections.mostLiked',
    params: { order: 'votes', reverse: true },
  },
  {
    name: 'exploreViewSections.nowPlaying',
    params: { order: 'clicktimestamp', reverse: true },
  },
  {
    name: 'exploreViewSections.lastChanged',
    params: { order: 'changetimestamp', reverse: true },
  },
  {
    name: 'exploreViewSections.random',
    params: { order: 'random' },
  },
]);

const countryOptions = computed(() => [
  { text: i18n.t('all'), value: 'all' },
  ...appStore.countries.map((country) => ({
    text: `${getFlagEmoji(
      country.code.toUpperCase()
    )} [${country.code.toUpperCase()}] ${country.name}`,
    value: country.code,
  })),
]);
const languageOptions = computed(() => [
  { text: i18n.t('all'), value: undefined },
  ...appStore.languages.map((language) => ({
    text: language.name,
    value: language.name,
  })),
]);

const { exploreViewCountry, exploreViewLanguage } = storeToRefs(appStore);

function getParams(section: Section) {
  const countryCode =
    exploreViewCountry.value === 'all' ? undefined : exploreViewCountry.value;
  const language =
    exploreViewLanguage.value === 'all' ? undefined : exploreViewLanguage.value;
  return {
    ...section.params,
    ...{
      limit: 12,
      hideBroken: true,
      countryCode,
      languageName: language,
    },
  };
}
</script>

<template>
  <stations-list
    v-if="false"
    :name="$t('stations.lastListened')"
    :stationsUUIDs="playerStore.history.slice(0, 12)"
    noStationsIcon="explore"
    noStationsText=""
    style="height: inherit !important"
  />
  <div class="chips__container">
    <base-chip-dropdown
      icon="language"
      :label="$t('station.country')"
      v-model="exploreViewCountry"
      :options="countryOptions"
    />
    <base-chip-dropdown
      icon="translate"
      :label="$t('station.language')"
      v-model="exploreViewLanguage"
      :options="languageOptions"
    />
  </div>
  <stations-list
    v-for="(section, index) in sections"
    :key="index"
    :name="$t(section.name)"
    :params="getParams(section)"
    noStationsIcon="explore"
    :noStationsText="$t('noStationsRegion')"
    style="height: inherit !important"
  />
</template>
