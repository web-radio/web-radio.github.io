<script setup lang="ts">
import { getUserCountryCode } from '@/api/freeipapi';
import { CenterContainer } from '@/components';
import { NavigationDrawer, PlayerBar, PlayerBarFullscreen } from '@/layout';
import { useAppStore, usePlayerStore } from '@/stores';
import { useOnline } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onBeforeMount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView } from 'vue-router';

const appStore = useAppStore();
const playerStore = usePlayerStore();
const online = useOnline();
const { locale } = useI18n();
const { language } = storeToRefs(appStore);
const loading = ref(true);

playerStore.metadataClient.subscribe(({ title, error }) => {
  if (!error) {
    playerStore.setTrackTitle(title);
  }
});
watch(language, () => {
  locale.value = appStore.language;
});
if (playerStore.station) {
  document.title = `WebRadio2 - ${playerStore.station.name}`;
}
onBeforeMount(async () => {
  const servers = await appStore.apiClient.getServers();
  appStore.apiClient.setServer(
    servers[Math.floor(Math.random() * servers.length)].name
  );
  if (appStore.exploreViewCountry === 'auto') {
    const userCountry = await getUserCountryCode();
    appStore.setExploreViewCountry(userCountry);
  }
  appStore.setCountries(await appStore.apiClient.getCountries({}));
  appStore.setLanguages(await appStore.apiClient.getLanguages({}));
  loading.value = false;
});
</script>

<template>
  <center-container type="loading" v-if="loading" style="height: 100vh" />
  <template v-else>
    <div class="internet-info" v-if="!online">
      {{ $t('noInternetConnection') }}
    </div>
    <div class="container">
      <navigation-drawer />
      <main>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" :key="$route.fullPath" />
          </keep-alive>
        </router-view>
      </main>
    </div>
    <player-bar v-if="playerStore.station" />
    <player-bar-fullscreen v-if="playerStore.station" />
  </template>
</template>

<style lang="scss">
@media screen and (max-width: 750px) {
  main {
    padding: 122px 20px 20px 20px;
  }
  #app:has(.player-bar) {
    .container {
      main {
        padding-bottom: 176px;
      }
      nav.navigation {
        padding-bottom: 156px;
      }
    }
  }
}

@media screen and (min-width: 751px) {
  main {
    padding: 40px;
  }
  #app:has(.player-bar) {
    .container {
      main {
        padding-bottom: 130px;
      }
      nav.navigation {
        padding-bottom: 91px;
      }
    }
  }
}

#app {
  background-color: #050509;
  min-height: 100vh;
  color: #fff;
  font-family: 'Poppins', sans-serif !important;
  width: 100%;
  display: flex;
  flex-direction: column;

  .internet-info {
    background-color: #101018;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1005;
    padding: 5px;
    font-size: 14px;
    text-align: center;
  }
  .container {
    flex: 1;
    display: flex;
    align-items: stretch;
    main {
      flex: 1;
    }
  }
}
</style>
