<script setup lang="ts">
import { twMerge, type ClassNameValue } from 'tailwind-merge';

defineProps<{
  label?: string;
  icon?: string;
  iconClass?: string;
  iconPosition?: 'left' | 'right';
}>();
</script>

<template>
  <button v-bind="$attrs" :class="twMerge('flex items-center gap-2 px-3 py-2 cursor-pointer disabled:cursor-default rounded-md bg-game-foreground-a active:bg-game-highlight hover:bg-game-highlight focus:inset-ring-2 focus:inset-ring-game-focus disabled:opacity-40 transition', $attrs.class as ClassNameValue)">
    <slot>
      <img v-if="icon" :src="icon" :class="[twMerge('size-4', iconClass), iconPosition === 'left' ? 'order-1' : 'order-3']" />

      <span v-if="label" class="order-2 font-bold">{{ label }}</span>
    </slot>
  </button>
</template>
