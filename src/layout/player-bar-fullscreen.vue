<script setup lang="ts">
import { useAppStore, usePlayerStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const playerStore = usePlayerStore();
const appStore = useAppStore();
const { station } = storeToRefs(playerStore);
const logoError = ref(false);
watch(station, () => {
  logoError.value = false;
});
</script>

<template>
  <div
    class="player-bar-fullscreen"
    :class="{ 'player-bar-fullscreen--visible': appStore.fullscreen }"
  >
    <img
      class="player-bar-fullscreen__image"
      :src="playerStore.station!.faviconUrl"
      @error.prevent="logoError = true"
      v-if="!logoError && playerStore.station!.faviconUrl"
    />
    <div class="material-symbols-rounded fullscreen__image" v-else>radio</div>
    <div class="player-bar-fullscreen__text">
      <div class="player-bar-fullscreen__title">
        {{ playerStore.station!.name.trim() ?? $t('withoutName') }}
      </div>
      <div
        class="player-bar-fullscreen__description"
        v-if="
        playerStore.trackTitle &&
        playerStore.trackTitle.toUpperCase() !==
          playerStore.station!.name.toUpperCase()
      "
      >
        {{ playerStore.trackTitle }}
      </div>
    </div>
    <div class="player-bar-fullscreen__actions">
      <div class="player-bar-fullscreen__actions-line">
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
          @click="playerStore.play(playerStore.station!)"
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
      </div>
      <div class="player-bar-fullscreen__actions-line">
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
          :class="{
          'icon-button--filled-icon': playerStore.votedStations.includes(
            playerStore.station!.stationUUID
          ),
        }"
          @click="playerStore.voteForStation(playerStore.station!)"
          :disabled="
          playerStore.votedStations.includes(playerStore.station!.stationUUID)
        "
        >
          <span class="material-symbols-rounded" style="font-size: 20px"
            >thumb_up</span
          >
        </button>
      </div>
    </div>
    <button
      class="player-bar-fullscreen-close"
      @click="appStore.toggleFullscreen"
    >
      <span class="material-symbols-rounded" style="font-size: 30px">
        close
      </span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@media screen and (max-height: 440px), screen and (max-width: 380px) {
  .player-bar-fullscreen {
    padding: 45px;
    gap: 15px;
    .player-bar-fullscreen__image {
      height: 70px;
    }
    .player-bar-fullscreen__text {
      .player-bar-fullscreen__title {
        font-size: 26px;
      }
    }
  }
}
@media screen and (min-height: 441px) and (min-width: 381px) {
  .player-bar-fullscreen {
    padding: 75px;
    gap: 25px;
    .player-bar-fullscreen__image {
      height: 100px;
    }
    .player-bar-fullscreen__text {
      .player-bar-fullscreen__title {
        font-size: 34px;
      }
    }
  }
}

.player-bar-fullscreen-close {
  position: fixed;
  z-index: 1010;
  top: 20px;
  right: 20px;
  border: 0;
  background: none;
  outline: none;
  color: #fff;
  cursor: pointer;
}
.player-bar-fullscreen {
  display: none;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #050509;

  &.player-bar-fullscreen--visible {
    display: flex !important;
  }

  .player-bar-fullscreen__image {
    border-radius: 5px;
    &.material-symbols-rounded {
      width: 100px;
      text-align: center;
      line-height: 100px;
    }
  }
  .player-bar-fullscreen__text {
    text-align: center;
    .player-bar-fullscreen__title {
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .player-bar-fullscreen__description {
      font-size: 14px;
      line-height: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .player-bar-fullscreen__actions {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 5px;
    .player-bar-fullscreen__actions-line {
      display: flex;
      gap: 10px;
    }
  }
}
</style>
