<script setup lang="ts">
import { v4 as uuid } from 'uuid';
import { nextTick, onMounted, ref, watch } from 'vue';
import { twMerge, type ClassNameValue } from 'tailwind-merge';

import Button from '@/components/buttons/Button.vue';

import addIconPath from '@icons/add.svg';
import removeIconPath from '@icons/remove.svg';

const model = defineModel<number | null>();

const props = defineProps<{
  label?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  nullable?: boolean;
  useGrouping?: boolean;
  minDecimals?: number;
  maxDecimals?: number;
  inputClass?: ClassNameValue;
}>();

const inputId = `id-${uuid()}`;

const initialInputPaddingX = 12;

const inputElement = ref<HTMLInputElement>({} as HTMLInputElement);
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

function parse(value: string): number | null {
  value = value
    .trim()
    .replace(/\s/g, '')
    .replace(',', '');

  let parsed: number | null = parseFloat(value);

  if (!isNaN(parsed)) {
    if (props.min != null && parsed < props.min) {
      parsed = props.min;
    }

    if (props.max != null && parsed > props.max) {
      parsed = props.max;
    }
  }

  if (isNaN(parsed)) {
    parsed = props.nullable ? null : props.min ?? 0;
  }

  return parsed;
}

function validate(value: number | null): number | null {
  if (value === null) {
    return props.nullable ? null : props.min ?? 0;
  }

  if (isNaN(value)) {
    return props.nullable ? null : props.min ?? 0;
  }

  if (props.min != null && value < props.min) {
    value = props.min;
  }

  if (props.max != null && value > props.max) {
    value = props.max;
  }

  return value;
}

function format(value: number | null): string {
  if (value === null) {
    return '';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    useGrouping: props.useGrouping,
    minimumFractionDigits: props.minDecimals,
    maximumFractionDigits: props.maxDecimals,
  });

  return formatter.format(value);
}

function onKeyDown(event: KeyboardEvent) {
  const code = event.code;
  const key = event.key;

  const isNumber = !isNaN(parseFloat(key));

  const isAllowedCode = ['Backspace', 'Delete'].includes(code);
  const isAllowedKey = ['.', '-'].includes(key);

  if (!isNumber && !isAllowedCode && !isAllowedKey) {
    event.preventDefault();
  }
}

function onBlur(event: FocusEvent) {
  const input = event.target as HTMLInputElement;

  model.value = validate(parse(input.value));
}

function decrease() {
  if (!props.step) {
    return;
  }

  model.value = validate(model.value ? model.value - props.step : -props.step);
}
function increase() {
  if (!props.step) {
    return;
  }

  model.value = validate(model.value ? model.value + props.step : props.step);
}

watch(model, function (value) {
  inputElement.value.value = format(value === undefined ? null : value);
});

onMounted(function () {
  nextTick(function () {
    calculateInputPaddingX();

    if (model.value !== undefined) {
      inputElement.value.value = format(model.value);
    }
  });
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="block ml-0.5">
      {{ label }}
    </label>

    <div class="flex items-stretch">
      <Button v-if="step" :icon="removeIconPath" @click="decrease" class="rounded-r-none" />

      <div class="w-full relative flex items-center">
        <span v-if="prefix" ref="prefixElement" class="absolute left-3 text-game-text/60 text-sm select-none pointer-events-none">
          {{ prefix }}
        </span>

        <input
          ref="inputElement"
          :id="inputId"
          :placeholder="placeholder"
          type="text"
          role="spinbutton"
          :class="[
            twMerge('w-full py-1 bg-game-shadow/20 hover:bg-game-foreground-a rounded-md border-2 border-game-foreground-a active:border-game-focus focus:border-game-focus placeholder-game-low-priority outline-none transition', inputClass),
            { 'rounded-l-none rounded-r-none': step }
          ]"
          :style="{ paddingLeft: inputPaddingLeft, paddingRight: inputPaddingRight }"
          @keydown="onKeyDown"
          @blur="onBlur" />

        <span v-if="suffix" ref="suffixElement" class="absolute right-3 text-game-text/60 text-sm select-none pointer-events-none">
          {{ suffix }}
        </span>
      </div>

      <Button v-if="step" :icon="addIconPath" @click="increase" class="rounded-l-none" />
    </div>
  </div>
</template>
