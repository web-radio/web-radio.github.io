<script setup lang="ts">
import { useAppStore, usePlayerStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const playerStore = usePlayerStore();
const appStore = useAppStore();
const router = useRouter();
const { station } = storeToRefs(playerStore);
const logoError = ref(false);
watch(station, () => {
  logoError.value = false;
});
</script>

<template>
  <div class="player-bar" v-if="playerStore.station">
    <img
      class="player-bar__image"
      :src="playerStore.station.faviconUrl"
      @error.prevent="logoError = true"
      v-if="!logoError && playerStore.station.faviconUrl"
    />
    <div class="material-symbols-rounded player-bar__image" v-else>radio</div>
    <div class="player-bar__title">
      {{ playerStore.station.name.trim() ?? $t('station.withoutName') }}
    </div>
    <div
      class="player-bar__description"
      v-if="
        playerStore.trackTitle &&
        playerStore.trackTitle.toUpperCase() !==
          playerStore.station.name.toUpperCase()
      "
    >
      {{ playerStore.trackTitle }}
    </div>
    <div class="player-bar__actions">
      <button
        class="icon-button icon-button--large icon-button--active player-bar__info-button"
        @click="router.push(`/s/${playerStore.station.stationUUID}`)"
      >
        <span class="material-symbols-rounded" style="font-size: 20px"
          >info</span
        >
      </button>
      <button
        class="icon-button icon-button--large icon-button--active"
        @click="
          playerStore.audio.volume
            ? playerStore.audio.setVolume(0)
            : playerStore.audio.setVolume(1)
        "
      >
        <span class="material-symbols-rounded">
          {{ playerStore.audio.volume ? 'volume_up' : 'no_sound' }}
        </span>
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        class="range-input"
        style="width: 10em"
        v-model="playerStore.audio.audio.volume"
      />
      <button
        class="icon-button icon-button--large icon-button--active"
        @click="playerStore.audio.changeCurrentTime(-10)"
        :disabled="
          playerStore.audio.currentTime < 10 || playerStore.audio.paused
        "
      >
        <span class="material-symbols-rounded"> replay_10 </span>
      </button>
      <button
        class="icon-button icon-button--large icon-button--active"
        @click="playerStore.play(playerStore.station)"
      >
        <span class="material-symbols-rounded" v-if="playerStore.audio.error">
          error
        </span>
        <div
          class="spinner spinner--small"
          v-else-if="playerStore.audio.waiting"
        />
        <span
          class="material-symbols-rounded"
          v-else-if="playerStore.audio.paused"
        >
          play_arrow
        </span>
        <span class="material-symbols-rounded" v-else> pause </span>
      </button>
      <button
        class="icon-button icon-button--large icon-button--active"
        @click="playerStore.audio.changeCurrentTime(10)"
        :disabled="
          playerStore.audio.duration - playerStore.audio.currentTime < 10 ||
          playerStore.audio.paused
        "
      >
        <span class="material-symbols-rounded"> forward_10 </span>
      </button>
      <button
        class="icon-button icon-button--large icon-button--active"
        :class="{
          'icon-button--filled-icon': playerStore.votedStations.includes(
            playerStore.station.stationUUID
          ),
        }"
        @click="playerStore.voteForStation(playerStore.station)"
        :disabled="
          playerStore.votedStations.includes(playerStore.station.stationUUID)
        "
      >
        <span class="material-symbols-rounded" style="font-size: 20px"
          >thumb_up</span
        >
      </button>
      <button
        class="icon-button icon-button--large icon-button--active"
        @click="appStore.toggleFullscreen"
      >
        <span class="material-symbols-rounded" style="font-size: 20px"
          >fullscreen</span
        >
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 750px) {
  .range-input {
    display: none !important;
  }
  .player-bar {
    grid-template-columns: min-content 1fr !important;
    grid-template-rows: repeat(3, auto) !important;
  }
  .player-bar__title {
    font-size: 16px;
    line-height: 27.5px;
  }
  .player-bar__description {
    font-size: 12px;
    line-height: 22.5px;
  }
  .player-bar__actions {
    justify-content: center;
    padding-top: 10px;
    grid-area: 3 / 1 / 4 / 3 !important;
    button.player-bar__info-button {
      display: block !important;
    }
  }
}
.player-bar {
  border-top: 1px solid #2b2b2b;
  position: fixed;
  left: 0;
  width: 100vw;
  display: grid;
  grid-template-columns: min-content auto min-content;
  grid-template-rows: repeat(2, auto);
  grid-column-gap: 20px;
  grid-row-gap: 0px;
  padding: 20px 25px;
  background: #05050950;
  backdrop-filter: blur(0.6em);
  z-index: 1004;
  bottom: 0;
  &:has(.player-bar__description) > .player-bar__title {
    grid-area: 1 / 2 / 2 / 3 !important;
    line-height: inherit !important;
  }
  .player-bar__image {
    grid-area: 1 / 1 / 3 / 2;
    height: 50px;
    border-radius: 5px;
    &.material-symbols-rounded {
      width: 50px;
      text-align: center;
      line-height: 50px;
    }
  }
  .player-bar__description {
    grid-area: 2 / 2 / 3 / 3;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .player-bar__title {
    grid-area: 3 / 2 / 1 / 3;
    line-height: 50px;
    font-size: 18px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .player-bar__actions {
    grid-area: 1 / 3 / 3 / 4;
    display: flex;
    gap: 10px;
    align-items: center;
    button.player-bar__info-button {
      display: none;
    }
  }
}
</style>
