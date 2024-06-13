import AudioService from '@/audio-service';
import { createMetadataClient } from '@radiolise/metadata-client';
import { StorageSerializers, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Station } from 'radiobrowser-api-client';
import { ref } from 'vue';
import { useAppStore } from './app';

export const usePlayerStore = defineStore('playerStore', () => {
  const metadataClient = createMetadataClient({
    url: 'wss://backend.radiolise.com/api/data-service',
  });
  const trackTitle = ref<string | null>(null);
  function setTrackTitle(title: string) {
    trackTitle.value = title;
  }

  const votedStations = useStorage<string[]>('votedStations', []);
  function voteForStation(station_: Station) {
    if (!votedStations.value.includes(station_.stationUUID)) {
      const { apiClient } = useAppStore();
      apiClient.voteForStation(station_.stationUUID);
      votedStations.value.push(station_.stationUUID);
    }
  }

  const history = useStorage<string[]>('history', []);
  function addStationToHistory() {
    const newHistory = history.value;
    newHistory.unshift(station.value!.stationUUID);
    history.value = [...new Set(newHistory)];
    if (history.value.length > 50) {
      history.value.pop();
    }
  }
  function clearHistory() {
    history.value = [];
  }

  const station = useStorage<Station | null>('station', null, undefined, {
    serializer: StorageSerializers.object,
  });
  const audio = new AudioService();
  function registerClick() {
    const { apiClient } = useAppStore();
    apiClient.click(station.value!.stationUUID);
  }
  function play(newStation: Station) {
    if (station.value?.stationUUID !== newStation.stationUUID) {
      station.value = newStation;
      addStationToHistory();
      registerClick();
      audio.setSource(`${station.value.urlResolved}#${Date.now().toString()}`);
      audio.play();
      if (station.value.name) {
        document.title = `WebRadio2 - ${station.value.name}`;
      }
      trackTitle.value = null;
      metadataClient.trackStream(newStation.urlResolved);
      return;
    }
    if (audio.paused.value) {
      audio.setSource(`${station.value.urlResolved}#${Date.now().toString()}`);
      audio.play();
      return;
    }
    audio.pause();
  }

  return {
    audio,
    station,
    play,
    trackTitle,
    metadataClient,
    setTrackTitle,
    votedStations,
    voteForStation,
    history,
    clearHistory,
  };
});
