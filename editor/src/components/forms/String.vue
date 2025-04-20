<script setup lang="ts">
import { v4 as uuid } from 'uuid';
import { nextTick, onMounted, ref } from 'vue';
import { twMerge, type ClassNameValue } from 'tailwind-merge';

const model = defineModel<string | null>();

defineProps<{
  label?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  readonly?: boolean;
  inputClass?: ClassNameValue;
}>();

const inputId = `id-${uuid()}`;

const initialInputPaddingX = 12;

const prefixElement = ref<HTMLElement>();
const suffixElement = ref<HTMLElement>();
const inputPaddingLeft = ref<string>(`${initialInputPaddingX}px`);
const inputPaddingRight = ref<string>(`${initialInputPaddingX}px`);

function calculateInputPaddingX() {
  const gap = 6;

  if (prefixElement.value) {
    inputPaddingLeft.value = `${prefixElement.value.clientWidth + gap + initialInputPaddingX}px`;
  }

  if (suffixElement.value) {
    inputPaddingRight.value = `${suffixElement.value.clientWidth + gap + initialInputPaddingX}px`;
  }
}

onMounted(function () {
  nextTick(function () {
    calculateInputPaddingX();
  });
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="block ml-0.5">
      {{ label }}
    </label>

    <div class="relative flex items-center">
      <span v-if="prefix" ref="prefixElement" class="absolute left-3 text-game-text/60 text-sm select-none pointer-events-none">
        {{ prefix }}
      </span>

      <input
        v-model="model"
        :id="inputId"
        :placeholder="placeholder"
        :readonly="readonly"
        type="text"
        :class="twMerge('w-full py-1 bg-game-shadow/20 hover:bg-game-foreground-a rounded-md border-2 border-game-foreground-a active:border-game-focus focus:border-game-focus outline-none transition', inputClass)"
        :style="{ paddingLeft: inputPaddingLeft, paddingRight: inputPaddingRight }" />

      <span v-if="suffix" ref="suffixElement" class="absolute right-3 text-game-text/60 text-sm select-none pointer-events-none">
        {{ suffix }}
      </span>
    </div>
  </div>
</template>
