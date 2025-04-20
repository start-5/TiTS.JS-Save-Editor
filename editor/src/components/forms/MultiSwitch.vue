<script setup lang="ts">
import type { SelectOptions, SelectOptionValue as SelectOptionValueBase } from '@shared/types/editor/ui';

import Button from '@/components/buttons/Button.vue';
import Switch from '@/components/forms/Switch.vue';

type SelectOptionValue = Exclude<SelectOptionValueBase, boolean>

const model = defineModel<SelectOptionValue[]>();

const props = defineProps<{
  label?: string;
  options?: SelectOptions<SelectOptionValue>;
}>();

function onToggleClicked() {
  if (model.value === undefined || props.options === undefined) {
    return;
  }

  const anySelected = model.value.length > 0;

  if (anySelected) {
    model.value = [];
  }
  else {
    model.value = props.options.map(function (option) {
      return option.value;
    });
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 rounded-md border-2 border-game-foreground-a">
    <div v-if="label" class="flex justify-between border-b-2 border-game-foreground-a px-3 py-2">
      <span>{{ label }}</span>
      <Button label="Toggle" @click="onToggleClicked" class="text-sm px-2 py-0" />
    </div>

    <div class="grid grid-cols-2 gap-4 p-2">
      <template v-for="option in options" :key="option.value">
        <Switch v-model="model" :value="option.value" :label="option.label" />
      </template>
    </div>
  </div>
</template>
