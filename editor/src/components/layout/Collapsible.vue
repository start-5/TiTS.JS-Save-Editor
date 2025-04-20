<script setup lang="ts">
import { ref } from 'vue';

import HeightTransition from '@/components/transitions/HeightTransition.vue';

import Button from '@/components/buttons/Button.vue';

import downIconPath from '@icons/down.svg';

defineProps<{
  label?: string;
}>();

const isExpanded = ref(false);

function onHeaderClicked() {
  isExpanded.value = !isExpanded.value;
}
</script>

<template>
  <div class="w-full">
    <Button @click="onHeaderClicked" class="z-10 w-full flex justify-between items-center p-2" :class="{ 'rounded-b-none': isExpanded }">
      <span class="truncate">{{ label }}</span>

      <img :src="downIconPath" class="size-6 transition" :class="{ 'rotate-180': isExpanded }" />
    </Button>

    <HeightTransition>
      <div v-if="isExpanded" class="rounded-md rounded-t-none border-2 border-game-foreground-a p-4">
        <slot></slot>
      </div>
    </HeightTransition>
  </div>
</template>
