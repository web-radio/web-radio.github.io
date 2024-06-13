<script setup lang="ts">
import { StationsList } from '@/components';
import { useAppStore, usePlayerStore } from '@/stores';
import { storeToRefs } from 'pinia';
import type { ISearchStation } from 'radiobrowser-api-client';
import { ref } from 'vue';

interface Section {
  name: string;
  params: ISearchStation;
  stationUUIDs?: string[];
}

const appStore = useAppStore();
const playerStore = usePlayerStore();
const sections = ref<Section[]>([
  {
    name: 'exploreViewSections.mostPopular',
    params: { order: 'clickcount', reverse: true },
  },
  {
    name: 'exploreViewSections.lastListened',
    params: {},
    stationUUIDs: playerStore.history.slice(0, 12),
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
const { exploreViewCountry } = storeToRefs(appStore);

function getParams(section: Section) {
  if (section.stationUUIDs) return;
  const countryCode =
    exploreViewCountry.value === 'all' ? undefined : exploreViewCountry.value;
  return {
    ...section.params,
    ...{
      limit: 12,
      hideBroken: true,
      countryCode,
    },
  };
}
</script>

<template>
  <stations-list
    v-for="(section, index) in sections.filter(
      (section) => !section.stationUUIDs || section.stationUUIDs.length === 12
    )"
    :key="index"
    :name="$t(section.name)"
    :params="getParams(section)"
    :stationsUUIDs="section.stationUUIDs"
    noStationsIcon="explore"
    :noStationsText="$t('noStationsRegion')"
    style="height: inherit !important"
  />
</template>
