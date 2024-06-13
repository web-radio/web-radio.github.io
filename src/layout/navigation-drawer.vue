<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

interface NavigationItem {
  link: string;
  text: string;
  icon: string;
}
const mobile = window.innerWidth <= 750;
const miniNav = ref(false);
const navigationItems: NavigationItem[] = [
  {
    link: '/',
    text: 'nav.explore',
    icon: 'explore',
  },
  {
    link: '/search',
    text: 'nav.search',
    icon: 'search',
  },
  {
    link: '/map',
    text: 'nav.map',
    icon: 'map',
  },
  {
    link: '/history',
    text: 'nav.history',
    icon: 'history',
  },
  {
    link: '/voted',
    text: 'nav.voted',
    icon: 'thumb_up',
  },
  {
    link: '/settings',
    text: 'nav.settings',
    icon: 'settings',
  },
];

function toggleMiniNav() {
  miniNav.value = !miniNav.value;
}
function onNavigationItemClick() {
  if (mobile) toggleMiniNav();
}
</script>

<template>
  <header class="navigation--mini__screen-header" v-if="miniNav">
    <button
      class="icon-button icon-button--large icon-button--active"
      @click="toggleMiniNav"
    >
      <span
        class="material-symbols-rounded"
        style="font-size: 16px; line-height: normal"
        >menu</span
      >
    </button>
    <p>WebRadio2</p>
  </header>
  <nav
    class="navigation"
    :class="{
      'navigation--mini': miniNav,
      'navigation--large': !miniNav,
    }"
  >
    <ul class="navigation__list">
      <li class="navigation__list-item">
        <button class="icon-button icon-button--large" @click="toggleMiniNav">
          <span class="material-symbols-rounded" style="font-size: 18px"
            >menu</span
          >
        </button>
      </li>
      <li
        class="navigation__list-item"
        v-for="(item, index) in navigationItems"
        :key="index"
      >
        <router-link
          class="navigation__list-item-link"
          :to="item.link"
          active-class="navigation__list-item-link--active"
          @click="onNavigationItemClick"
        >
          <div class="material-symbols-rounded" style="font-size: 18px">
            {{ item.icon }}
          </div>
          <span class="navigation__list-item-link-name">
            {{ $t(item.text) }}
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 750px) {
  nav.navigation {
    position: fixed;
    height: 100vh;
    background: #050509cc !important;
    backdrop-filter: blur(0.6em) !important;

    ul.navigation__list {
      li.navigation__list-item {
        .icon-button {
          padding: 15px 25px;
        }
        a.navigation__list-item-link {
          padding: 15px 25px;
        }
      }
    }
    &.navigation--mini {
      width: 300px !important;
      left: -300px;
    }
    &.navigation--large {
      left: 0;
    }
  }
  header.navigation--mini__screen-header {
    display: flex !important;
  }
}

@media screen and (min-width: 751px) {
  nav.navigation {
    position: sticky;
    &.navigation--mini {
      ul.navigation__list {
        li.navigation__list-item {
          .icon-button {
            padding: 15px;
          }
          a.navigation__list-item-link {
            padding: 15px;
            width: 48px;
          }
          span.navigation__list-item-link-name {
            display: none;
          }
        }
      }
    }
  }
}
nav.navigation {
  top: 0;
  left: 0;
  max-height: 100vh;
  border-right: 1px solid #2b2b2b;
  overflow: auto;
  z-index: 1003;
  transition: left 0.05s ease-out;

  &.navigation--large {
    width: 300px;
    ul.navigation__list {
      li.navigation__list-item {
        .icon-button {
          padding: 15px 25px;
        }
        a.navigation__list-item-link {
          padding: 15px 25px;
        }
      }
    }
  }

  ul.navigation__list {
    padding: 20px;
    margin: 0;
    list-style: none;
    li.navigation__list-item {
      padding: 0;
      margin: 0;
      a.navigation__list-item-link {
        transition: all ease-out 0.1s;
        display: flex;
        align-items: center;
        gap: 15px;
        color: #a0a0a0;
        text-decoration: none;
        border-radius: 7px;
        font-weight: 400;
        font-size: 14px;
        line-height: 14px;
        font-weight: 500;

        &.navigation__list-item-link--active {
          background: #ffffff09;
          color: #fff;
        }

        &:hover {
          color: #fff;
        }
      }
    }
  }
}

header.navigation--mini__screen-header {
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  transition: all ease-out 0.1s;
  color: #fff;
  font-weight: 600;
  padding: 15px 15px;
  border-radius: 5px;
  background: #11111150;
  backdrop-filter: blur(1.7em);
  z-index: 11;
  line-height: 30px;
  p {
    line-height: 0;
    margin: 15px 0;
  }
}
</style>
