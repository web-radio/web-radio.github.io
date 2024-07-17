<script lang="ts" setup>
import VDropdownMenu from 'v-dropdown-menu';
import { computed } from 'vue';

const props = defineProps<{
  icon: string;
  label?: string;
  required?: boolean;
  options: { text: string; value: any }[];
}>();
const model = defineModel();
function selectOption(optionValue: any) {
  if (model.value !== optionValue || props.required) model.value = optionValue;
  else model.value = undefined;
}
const selectedOption = computed(() =>
  props.options.find(
    (option) => JSON.stringify([option.value]) === JSON.stringify([model.value])
  )
);
</script>

<template>
  <v-dropdown-menu :overlay="false" style="width: 100%">
    <template #trigger>
      <button
        class="chip"
        :class="{ 'chip--active': model && model !== 'all' }"
      >
        <span class="material-symbols-rounded">{{ icon }}</span>
        {{ selectedOption?.value !== undefined ? selectedOption.text : label }}
        <span class="material-symbols-rounded" style="margin-left: 10px">
          keyboard_arrow_down
        </span>
      </button>
    </template>
    <template #body>
      <div class="dropdown__options">
        <div
          class="dropdown__option"
          v-for="(option, index) in options"
          :key="index"
          @click="selectOption(option.value)"
        >
          {{ option.text }}
        </div>
      </div>
    </template>
  </v-dropdown-menu>
</template>

<style lang="scss">
.dropdown__options {
  margin-top: 5px;
  max-height: calc(100vh - 340px);
  background: #09090d;
  border-radius: 7px;
  border: 1px solid #ffffff10;
  overflow: scroll;
  z-index: 20;

  .dropdown__option {
    padding: 10px 15px;
    user-select: none;
    width: 100%;
    cursor: pointer;

    &:hover {
      background: #ffffff06;
    }
  }
}

.v-dropdown-menu__container {
  background-color: inherit !important;
  border: inherit !important;
}

.v-dropdown-menu {
  width: inherit !important;
}
</style>
