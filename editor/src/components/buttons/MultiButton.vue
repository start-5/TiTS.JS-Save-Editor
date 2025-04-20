<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

import type { SelectOption, SelectOptions, SelectOptionValue } from '@shared/types/editor/ui';

import Button from '@/components/buttons/Button.vue';

const model = defineModel<SelectOptionValue | null>();

const props = defineProps<{
  label?: string;
  options?: SelectOptions<SelectOptionValue>;
  nullable?: boolean;
  buttonClass?: string;
}>();

function onOptionClicked(option: SelectOption<SelectOptionValue>) {
  if (model.value !== option.value) {
    model.value = option.value;
  }
  else if (props.nullable) {
    model.value = null;
  }
}

function isOptionSelected(option: SelectOption<SelectOptionValue>) {
  return model.value === option.value;
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="block ml-0.5">
      {{ label }}
    </label>

    <div class="flex">
      <template v-for="option in options">
        <Button @click="onOptionClicked(option)" :label="option.label" :class="[
          twMerge('border-2 border-game-foreground-a rounded-none first:rounded-l-md last:rounded-r-md not-last:border-r-0', buttonClass),
          isOptionSelected(option) ? 'bg-game-highlight' : 'bg-transparent hover:bg-game-highlight/50',
        ]" />
      </template>
    </div>
  </div>
</template>
