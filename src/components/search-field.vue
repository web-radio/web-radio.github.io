<script lang="ts" setup>
const model = defineModel();
</script>

<template>
  <div class="search-field">
    <input
      class="search-field__input"
      v-model="model"
      :placeholder="$t('nav.search')"
    />
    <div class="search-field__icon">
      <span class="material-symbols-rounded">search</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-field {
  width: 100%;
  position: relative;
  max-width: 650px;

  .search-field__icon {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 15px;
    display: flex;
    align-items: center;
    .material-symbols-rounded {
      color: #fff;
      font-size: 20px;
    }
  }

  input.search-field__input {
    background: #ffffff04;
    border-radius: 7px;
    border: 1px solid #ffffff10;
    width: 100%;
    outline: none;
    color: #fff;
    font-family: 'Poppins', sans-serif !important;
    padding: 15px 15px 15px 50px;
    font-size: 14px;

    &::placeholder {
      color: #cfcfcf;
      line-height: 16px;
      font-family: 'Poppins', sans-serif !important;
    }
  }
}
</style>
