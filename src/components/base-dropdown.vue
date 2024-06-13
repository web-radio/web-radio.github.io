<script lang="ts" setup>
import VDropdownMenu from 'v-dropdown-menu';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const props = defineProps<{
  label: string;
  showOptionAll: boolean;
  options: { text: string; value: string }[];
}>();
const model = defineModel();
function selectOption(optionValue: string) {
  model.value = optionValue;
}
const selectedOption = computed(() =>
  model.value === 'all'
    ? { text: i18n.t('all'), value: 'all' }
    : props.options.find((option) => option.value === model.value)
);
</script>

<template>
  <v-dropdown-menu :overlay="false" style="width: 100%">
    <template #trigger>
      <div class="dropdown__field">
        <div class="dropdown__field-label">{{ props.label }}</div>
        <div class="dropdown__field-selected-option" v-if="selectedOption">
          {{ selectedOption.text }}
        </div>
      </div>
    </template>
    <template #body>
      <div class="dropdown__options">
        <div
          class="dropdown__option"
          v-if="props.showOptionAll"
          @click="selectOption('all')"
        >
          {{ $t('all') }}
        </div>
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
.dropdown__field {
  background: #ffffff04;
  border-radius: 7px;
  border: 1px solid #ffffff10;
  width: 100%;
  padding: 13px 15px;
  cursor: text;

  .dropdown__field-label {
    color: #cfcfcf;
    transition: all 0.075s ease-out;
    user-select: none;
    overflow: hidden;
    text-wrap: wrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-wrap: wrap;
    text-overflow: ellipsis;
  }

  &:has(> .dropdown__field-selected-option) {
    padding: 8px 15px !important;
    .dropdown__field-label {
      font-size: 14px;
      line-height: 17px;
    }
  }

  .dropdown__field-selected-option {
    color: #fff;
    line-height: 18px;
    font-size: 15px;
    overflow: hidden;
    text-wrap: wrap;
    text-overflow: ellipsis;
  }
}

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
  min-width: 100%;
  max-width: inherit !important;
  background-color: inherit !important;
  border: inherit !important;
}
</style>
