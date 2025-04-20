<script setup lang="ts">
import { v4 as uuid } from 'uuid';
import { twMerge, type ClassNameValue } from 'tailwind-merge';

import type { SelectOptions, SelectOptionValue } from '@shared/types/editor/ui';

import downIconPath from '@icons/down.svg';

const model = defineModel<SelectOptionValue | null>();

defineProps<{
  label?: string;
  placeholder?: string;
  options?: SelectOptions<SelectOptionValue>;
  inputClass?: ClassNameValue;
}>();

const inputId = `id-${uuid()}`;
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="block ml-0.5">
      {{ label }}
    </label>

    <div class="relative">
      <select
        v-model="model"
        :id="inputId"
        :class="twMerge('w-full px-3 py-1 bg-game-shadow/20 hover:bg-game-foreground-a rounded-md border-2 border-game-foreground-a active:border-game-focus focus:border-game-focus outline-none transition appearance-none cursor-pointer', inputClass)">
        <option v-if="placeholder" disabled value="" class="bg-game-background disabled:bg-game-background">{{ placeholder }}</option>
        <option v-for="(option, index) in options" :key="index" :value="option.value" class="bg-game-background">
          {{ option.label }}
        </option>
      </select>

      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <img :src="downIconPath" class="size-6" />
      </div>
    </div>
  </div>
</template>
