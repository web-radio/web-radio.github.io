<script setup lang="ts">
import { useAppStore, usePlayerStore } from '@/stores';
import { getFlagEmoji } from '@/utils';
import type { Station } from 'radiobrowser-api-client';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineProps<{
  data: Station;
}>();

const router = useRouter();
const playerStore = usePlayerStore();
const appStore = useAppStore();
const logoError = ref(false);
</script>

<template>
  <div
    class="card"
    :class="{
      card__active: playerStore.station?.stationUUID == data.stationUUID,
    }"
    :style="{
      'background-image':
        playerStore.station?.stationUUID == data.stationUUID && data.faviconUrl
          ? `url(${data.faviconUrl})`
          : '',
    }"
  >
    <div class="card__background">
      <img
        ref="stationLogo"
        class="card__image"
        :src="data.faviconUrl"
        @error.prevent="logoError = true"
        v-if="!logoError && data.faviconUrl"
      />
      <div class="material-symbols-rounded card__station-icon" v-else>
        radio
      </div>
      <div class="card__name">
        {{ data.name.trim() ? data.name.trim() : $t('withoutName') }}
      </div>
      <div class="card__details">
        <div class="card__details-chip" v-if="data.countryCode">
          {{ getFlagEmoji(data.countryCode) }}
          {{
            data.countryName.length <= 20 ? data.countryName : data.countryCode
          }}<template v-if="data.state">, {{ data.state }}</template>
        </div>
        <div
          class="card__details-chip"
          v-if="data.languageNames && appStore.cardMoreChips"
        >
          <span class="material-symbols-rounded">translate</span>
          {{
            data.languageNames.length <= 20 || !data.languageCodes
              ? data.languageNames
              : data.languageCodes
          }}
        </div>
        <div class="card__details-chip" v-if="data.hasExtendedInfo">
          <span class="material-symbols-rounded">verified</span>
          {{ $t('station.verified') }}
        </div>
        <div class="card__details-chip">
          <span class="material-symbols-rounded">visibility</span>
          {{ data.clickCount }}
          (24h)
        </div>
        <div class="card__details-chip">
          <span class="material-symbols-rounded">thumb_up</span>
          {{ data.votes }}
        </div>
        <div
          class="card__details-chip"
          v-if="data.clickTrend !== 0 && appStore.cardMoreChips"
        >
          <span class="material-symbols-rounded">{{
            data.clickTrend > 0 ? 'trending_up' : 'trending_down'
          }}</span>
          <template v-if="data.clickTrend > 0">+</template>{{ data.clickTrend }}
        </div>
        <div class="card__details-chip" v-if="data.codec !== 'UNKNOWN'">
          <span class="material-symbols-rounded">album</span> {{ data.codec }}
        </div>
        <div
          class="card__details-chip"
          v-if="data.bitrate && appStore.cardMoreChips"
        >
          <span class="material-symbols-rounded">speed</span>
          {{ data.bitrate }} kbps
        </div>
        <div
          class="card__details-chip"
          v-for="(tag, index) in data.tags.filter((tag: string) => (tag && tag.length <= 25))"
          :key="index"
        >
          {{ tag }}
        </div>
      </div>
      <div class="card__actions">
        <button
          class="icon-button icon-button--small"
          :class="{
            'icon-button--active':
              playerStore.station?.stationUUID === data.stationUUID,
          }"
          @click="router.push(`/s/${data.stationUUID}`)"
        >
          <span class="material-symbols-rounded" style="font-size: 20px"
            >info</span
          >
        </button>
        <button
          class="icon-button icon-button--small"
          :class="{
            'icon-button--active':
              playerStore.votedStations.includes(data.stationUUID) ||
              playerStore.station?.stationUUID === data.stationUUID,
            'icon-button--filled-icon': playerStore.votedStations.includes(
              data.stationUUID
            ),
          }"
          @click="playerStore.voteForStation(data)"
          :disabled="playerStore.votedStations.includes(data.stationUUID)"
        >
          <span class="material-symbols-rounded" style="font-size: 20px"
            >thumb_up</span
          >
        </button>
        <button
          class="icon-button icon-button--small"
          :class="{
            'icon-button--active':
              playerStore.station?.stationUUID === data.stationUUID,
          }"
          @click="playerStore.play(data)"
        >
          <span
            class="material-symbols-rounded"
            v-if="
              playerStore.station?.stationUUID === data.stationUUID &&
              playerStore.audio.error
            "
          >
            error
          </span>
          <div
            class="spinner spinner--small"
            v-else-if="
              playerStore.station?.stationUUID === data.stationUUID &&
              playerStore.audio.waiting
            "
          />
          <span
            class="material-symbols-rounded"
            v-else-if="
              playerStore.station?.stationUUID !== data.stationUUID ||
              playerStore.audio.paused
            "
          >
            play_arrow
          </span>
          <span class="material-symbols-rounded" v-else> pause </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card__active {
  .card__background {
    background: #ffffff10 !important;
    .card__details {
      color: #fff !important;
    }
  }

  &:has(.card__background > .card__image) {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    .card__background {
      background: #00000055 !important;
      backdrop-filter: blur(50px);
    }
  }
}

.card {
  border-radius: 7px;

  .card__background {
    background: #ffffff04;
    display: grid;
    grid-template-columns: minmax(auto, max-content) 1fr min-content;
    grid-template-rows: repeat(2, min-content);
    grid-column-gap: 17.5px;
    grid-row-gap: 10px;
    border: 1px solid #ffffff10;
    border-radius: 7px;
    padding: 18px;
    height: 100%;

    .card__image {
      grid-area: 1 / 1 / 2 / 2;
      min-width: 40px;
      height: 40px;
      border: none;
      outline: none;
      border-radius: 5px;
    }

    .card__station-icon {
      height: 40px;
      width: 40px;
      text-align: center;
      line-height: 40px;
    }

    .card__name {
      grid-area: 1 / 2 / 2 / 3;
      font-size: 1.05em;
      line-height: 40px;
      font-weight: 700;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .card__details {
      grid-area: 2 / 1 / 2 / 4;
      font-size: 0.9em;
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      max-height: 62px;
      overflow: hidden;

      .card__details-chip {
        padding: 2px 7px;
        border-radius: 5px;
        border: #ffffff10 solid 1px;
        background: #ffffff03;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 0.9em;
        height: min-content;
      }

      .material-symbols-rounded {
        font-size: 0.9em;
        line-height: normal;
      }
    }

    .card__actions {
      grid-area: 1 / 3 / 2 / 4;
      flex-basis: 100%;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: end;
    }
  }
}

@media screen and (max-width: 983px) {
  .card {
    .card__details {
      max-height: inherit !important;
    }

    .card__name {
      font-size: 0.9em !important;
    }
  }
}
</style>
