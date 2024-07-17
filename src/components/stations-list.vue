<script setup lang="ts">
import {
  CenterContainer,
  StationCard,
  StationCardSkeletonLoader,
} from '@/components';
import { useAppStore } from '@/stores';
import { sortStations } from '@/utils';
import type { ISearchStation, Station } from 'radiobrowser-api-client';
import { ref, watch, onBeforeMount, onActivated, onDeactivated } from 'vue';

const props = defineProps<{
  name?: string;
  params?: ISearchStation;
  showMoreButton?: boolean;
  stationsUUIDs?: string[];
  noStationsIcon: string;
  noStationsText: string;
}>();
const appStore = useAppStore();
const loading = ref(true);
const error = ref(false);
const stations = ref<Station[] | null>(null);
const reloadOnActivated = ref(false);
const activeComponent = ref(true);

async function loadStations() {
  stations.value = null;
  loading.value = true;
  error.value = false;
  try {
    const results = await getStations();
    stations.value = props.stationsUUIDs
      ? sortStations(props.stationsUUIDs, results)
      : results;
  } catch (err: any) {
    error.value = true;
  }
  loading.value = false;
}

async function loadMoreStations() {
  loading.value = true;
  try {
    const result = await getStations();
    stations.value = Array.isArray(stations.value)
      ? stations.value.concat(result)
      : result;
  } catch {
    // pass
  }
  loading.value = false;
}

async function getStations() {
  if (props.stationsUUIDs)
    return sortStations(
      props.stationsUUIDs,
      await appStore.apiClient.getStationsByUUIDs({
        stationUUIDs: props.stationsUUIDs,
      })
    );
  return await appStore.apiClient.searchStations({
    ...{ offset: stations.value?.length },
    ...props.params,
  });
}
let timeout: any = null;

watch(
  () => props.params,
  (oldValue, newValue) => {
    if (JSON.stringify(oldValue) == JSON.stringify(newValue)) return;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      activeComponent.value
        ? await loadStations()
        : (reloadOnActivated.value = true);
    }, 750);
  }
);

watch(
  () => props.stationsUUIDs,
  () => {
    if (!props.stationsUUIDs) return;
    if (
      stations.value &&
      props.stationsUUIDs.every((sUUID) =>
        stations.value!.find((station) => station.stationUUID === sUUID)
      )
    )
      stations.value = sortStations(props.stationsUUIDs, stations.value);
    else
      activeComponent.value ? loadStations() : (reloadOnActivated.value = true);
  }
);

onBeforeMount(async () => {
  await loadStations();
});

onActivated(async () => {
  activeComponent.value = true;
  if (reloadOnActivated.value) await loadStations();
  reloadOnActivated.value = false;
});

onDeactivated(() => {
  activeComponent.value = false;
});
</script>

<template>
  <div class="stations-list">
    <p class="headline" v-if="name">
      {{ name }}
    </p>
    <div class="stations-list__cards" v-if="stations?.length || loading">
      <template v-if="stations?.length">
        <station-card
          v-for="station in stations"
          :key="station.stationUUID"
          :data="station"
        />
      </template>
      <template v-if="loading">
        <station-card-skeleton-loader
          v-for="n in props.params?.limit ?? props.stationsUUIDs?.length ?? 20"
          :key="n"
        />
      </template>
    </div>
    <center-container
      v-if="error"
      type="info"
      icon="error"
      :text="$t('error')"
      button-icon="refresh"
      @button-click="loadStations"
    />
    <center-container
      v-if="stations?.length === 0 && !loading && !error"
      type="info"
      :icon="noStationsIcon"
      :text="noStationsText"
    />
    <button
      class="block-button"
      style="margin-top: 40px"
      v-if="
        !loading &&
        props.params &&
        stations?.length &&
        stations?.length % props.params.limit! === 0 &&
        showMoreButton
      "
      @click="loadMoreStations"
    >
      {{ $t('moreResults') }}
    </button>
  </div>
</template>

<style lang="scss">
@media screen and (max-width: 750px) {
  .stations-list {
    .stations-list__cards {
      grid-template-columns: minmax(min-content, 1fr) !important;
    }
  }
}

.stations-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: 40px;

  &:first-child {
    margin-top: 0 !important;
  }
  .stations-list__cards {
    width: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    grid-gap: 20px;
  }
}
</style>
