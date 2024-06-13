<script setup lang="ts">
import { StationsList } from '@/components';
import { usePlayerStore } from '@/stores';

const playerStore = usePlayerStore();
</script>

<template>
  <stations-list
    :name="$t('nav.voted')"
    :stationsUUIDs="playerStore.votedStations"
    noStationsIcon="thumb_up"
    :noStationsText="$t('noVoted')"
  />
</template>
