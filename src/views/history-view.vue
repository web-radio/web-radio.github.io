<script setup lang="ts">
import { usePlayerStore } from '@/stores';
import { StationsList } from '@/components';

const playerStore = usePlayerStore();
</script>

<template>
  <stations-list
    :name="$t('nav.history')"
    :stationsUUIDs="playerStore.history"
    noStationsIcon="history"
    :noStationsText="$t('noHistory')"
  />
</template>
