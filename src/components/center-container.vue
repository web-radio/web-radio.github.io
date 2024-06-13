<script setup lang="ts">
defineProps<{
  type: 'loading' | 'info';
  icon?: string;
  text?: string;
  buttonIcon?: string;
}>();
defineEmits(['buttonClick']);
</script>

<template>
  <div class="center-container">
    <div
      class="material-symbols-rounded"
      style="font-size: 40px"
      v-if="type === 'info'"
    >
      {{ icon }}
    </div>
    <div class="center-text" v-if="type === 'info'">
      {{ text }}
    </div>
    <button
      class="icon-button icon-button--large"
      v-if="buttonIcon"
      @click="$emit('buttonClick')"
    >
      <span class="material-symbols-rounded" style="font-size: 25px">
        {{ buttonIcon }}
      </span>
    </button>
    <div class="spinner spinner--large" v-if="type === 'loading'" />
  </div>
</template>

<style lang="scss" scoped>
.center-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .center-text {
    font-size: 20px;
    font-weight: 500;
  }
}
</style>
