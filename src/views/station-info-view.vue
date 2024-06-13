<script setup lang="ts">
import { CenterContainer } from '@/components';
import { useAppStore, usePlayerStore } from '@/stores';
import { getFlagEmoji } from '@/utils';
import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import type { Station } from 'radiobrowser-api-client';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

globalThis.L = L;

const appStore = useAppStore();
const playerStore = usePlayerStore();
const route = useRoute();
const error = ref(false);
const loading = ref(true);
const logoError = ref(false);
const station = ref<Station | null>(null);

async function loadStationData() {
  loading.value = true;
  error.value = false;
  if (route.params.id) {
    try {
      station.value =
        (
          await appStore.apiClient.getStationsByUUIDs({
            stationUUIDs: [route.params.id as string],
          })
        )[0] ?? null;
    } catch {
      error.value = true;
    }
  }
  loading.value = false;
}

onMounted(async () => await loadStationData());
</script>

<template>
  <div class="station-info" v-if="station">
    <div class="station-info__header">
      <img
        ref="stationLogo"
        class="station-info__header-logo"
        :src="station.faviconUrl"
        @error.prevent="logoError = true"
        v-if="!logoError && station.faviconUrl"
      />
      <div class="headline">{{ station.name }}</div>
    </div>
    <div class="station-info__buttons">
      <button class="station-info__button" @click="playerStore.play(station)">
        <template
          v-if="
            playerStore.station?.stationUUID === station.stationUUID &&
            !playerStore.audio.paused
          "
        >
          {{ $t('actions.stop') }}
        </template>
        <template
          v-else-if="
            playerStore.station?.stationUUID !== station.stationUUID ||
            playerStore.audio.paused
          "
          >{{ $t('actions.play') }}</template
        >
        <template v-else>{{ $t('error') }}</template>
        <span class="material-symbols-rounded">
          <template
            v-if="
              playerStore.station?.stationUUID === station.stationUUID &&
              !playerStore.audio.paused
            "
            >pause</template
          >
          <template
            v-else-if="
              playerStore.station?.stationUUID !== station.stationUUID ||
              playerStore.audio.paused
            "
            >play_arrow</template
          >
          <template v-else>error</template>
        </span>
      </button>
      <button
        class="station-info__button"
        :class="{
          'station-info__vote-button--active':
            playerStore.votedStations.includes(station.stationUUID),
        }"
        @click="playerStore.voteForStation(station)"
        :disabled="playerStore.votedStations.includes(station.stationUUID)"
      >
        {{
          playerStore.votedStations.includes(station.stationUUID)
            ? $t('actions.voted')
            : $t('actions.vote')
        }}
        <span class="material-symbols-rounded">thumb_up</span>
      </button>
    </div>
    <div class="station-info__subheader">
      {{ $t('station.generalInformation') }}
    </div>
    <table class="station-info__table">
      <tbody class="station-info__table-body">
        <tr class="station-info__table-row">
          <td class="station-info__table-row-key">{{ $t('station.id') }}</td>
          <td class="station-info__table-row-value">
            {{ station.stationUUID }}
          </td>
        </tr>
        <tr class="station-info__table-row">
          <td class="station-info__table-row-key">
            {{ $t('station.verified') }}
          </td>
          <td class="station-info__table-row-value">
            {{ station.hasExtendedInfo ? $t('yes') : $t('no') }}
          </td>
        </tr>
        <tr class="station-info__table-row" v-if="station.homepageUrl">
          <td class="station-info__table-row-key">
            {{ $t('station.website') }}
          </td>
          <td class="station-info__table-row-value">
            <a :href="station.homepageUrl" target="_blank">{{
              station.homepageUrl
            }}</a>
          </td>
        </tr>
        <tr class="station-info__table-row" v-if="station.tags.length">
          <td class="station-info__table-row-key">{{ $t('station.tags') }}</td>
          <td class="station-info__table-row-value">
            {{ station.tags.join(', ') }}
          </td>
        </tr>
        <tr class="station-info__table-row" v-if="station.countryCode">
          <td class="station-info__table-row-key">
            {{ $t('station.location') }}
          </td>
          <td class="station-info__table-row-value">
            {{ getFlagEmoji(station.countryCode) }}
            ({{ station.countryCode }})
            {{
              station.state
                ? `${station.countryName}, ${station.state}`
                : station.countryName
            }}
          </td>
        </tr>
        <tr
          class="station-info__table-row"
          v-if="station.languageNames.length !== 0"
        >
          <td class="station-info__table-row-key">
            {{ $t('station.language') }}
          </td>
          <td class="station-info__table-row-value">
            {{ station.languageNames }}
          </td>
        </tr>
        <tr class="station-info__table-row">
          <td class="station-info__table-row-key">{{ $t('station.votes') }}</td>
          <td class="station-info__table-row-value">{{ station.votes }}</td>
        </tr>
        <tr class="station-info__table-row">
          <td class="station-info__table-row-key">
            {{ $t('station.clicks24h') }}
          </td>
          <td class="station-info__table-row-value">
            {{ station.clickCount }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="station-info__subheader">{{ $t('station.audioSource') }}</div>
    <table class="station-info__table">
      <tbody class="station-info__table-body">
        <tr class="station-info__table-row">
          <td class="station-info__table-row-key">URL</td>
          <td class="station-info__table-row-value">
            <a :href="station.urlResolved" target="_blank">{{
              station.urlResolved
            }}</a>
          </td>
        </tr>
        <tr class="station-info__table-row">
          <td class="station-info__table-row-key">{{ $t('station.codec') }}</td>
          <td class="station-info__table-row-value">{{ station.codec }}</td>
        </tr>
        <tr class="station-info__table-row">
          <td class="station-info__table-row-key">
            {{ $t('station.bitrate') }}
          </td>
          <td class="station-info__table-row-value">
            {{ station.bitrate }} kbps
          </td>
        </tr>
      </tbody>
    </table>
    <a
      class="station-info__more"
      :href="`https://www.radio-browser.info/history/${station.stationUUID}`"
      target="_blank"
    >
      {{ $t('moreInfo') }}
    </a>
    <div
      class="station-info__subheader"
      v-if="station.geoLat && station.geoLong"
    >
      {{ $t('station.location') }}
    </div>
    <div class="station-info__map" v-if="station.geoLat && station.geoLong">
      <l-map
        :useGlobalLeaflet="false"
        :zoom="5"
        :center="[station.geoLat, station.geoLong]"
        style="height: 80vh"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          :no-wrap="true"
          :min-zoom="2"
          :max-zoom="16"
        />
        <l-marker :lat-lng="[station.geoLat, station.geoLong]" />
      </l-map>
    </div>
  </div>
  <center-container v-if="loading" type="loading" />
  <center-container
    v-else-if="error"
    type="info"
    icon="error"
    :text="$t('error')"
    button-icon="refresh"
    @button-click="loadStationData"
  />
  <center-container
    v-else-if="!station"
    type="info"
    icon="error"
    :text="$t('stationNotFound')"
  />
</template>

<style scoped lang="scss">
.station-info {
  .station-info__header {
    display: flex;
    align-items: center;
    gap: 15px;
    .station-info__header-logo {
      height: 50px;
      border-radius: 5px;
    }
  }
  .station-info__buttons {
    display: flex;
    gap: 15px;
    padding: 15px 0;
    button.station-info__button {
      display: flex;
      gap: 7px;
      background: #ffffff04;
      padding: 10px;
      border: 1px solid #ffffff10;
      border-radius: 7px;
      color: #fff;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      .material-symbols-rounded {
        font-size: 18px;
        line-height: normal;
      }
      &:disabled {
        cursor: not-allowed;
      }
    }
    button.station-info__vote-button--active {
      .material-symbols-rounded {
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
      }
    }
  }
  .station-info__subheader {
    line-height: 65px;
    font-size: 18px;
    font-weight: 600;
  }
  .station-info__table {
    border-collapse: separate;
    .station-info__table-body {
      .station-info__table-row {
        .station-info__table-row-key {
          padding: 0 30px 0 0;
          font-weight: 500;
        }
        .station-info__table-row-value {
          color: #eaeaea;
          a {
            color: #eaeaea;
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
  a.station-info__more {
    color: #fff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
