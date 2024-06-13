<script lang="ts" setup>
const props = defineProps<{
  label: string;
}>();

const model = defineModel();
</script>

<template>
  <div class="text-field">
    <input class="text-field__input" v-model="model" required :id="label" />
    <label class="text-field__label" :for="label">{{ props.label }}</label>
  </div>
</template>

<style lang="scss" scoped>
.text-field {
  width: 100%;
  position: relative;

  label.text-field__label {
    position: absolute;
    color: #cfcfcf;
    top: 19px;
    left: 20px;
    transition: all 0.075s ease-out;
    user-select: none;
    line-height: 16px;
    cursor: text;
  }

  input.text-field__input {
    background: #ffffff04;
    border-radius: 7px;
    border: 1px solid #ffffff10;
    width: 100%;
    outline: none;
    color: #fff;
    font-family: 'Poppins', sans-serif !important;
    padding: 23px 15px 7px 15px;
    font-size: 14px;
  }

  input.text-field__input:focus + label.text-field__label,
  input.text-field__input:valid + label.text-field__label {
    font-size: 14px;
    top: 7px;
    left: 15px;
  }
}
</style>
