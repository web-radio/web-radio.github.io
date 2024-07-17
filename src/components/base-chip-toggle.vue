<script setup lang="ts">
import { useToggle } from '@vueuse/core';

const model = defineModel();
defineProps<{ icon: string; text: string }>();
const toggle = useToggle(model);
</script>

<template>
  <button class="chip" :class="{ 'chip--active': model }" @click="toggle()">
    <span class="material-symbols-rounded">{{ icon }}</span>
    {{ text }}
  </button>
</template>
