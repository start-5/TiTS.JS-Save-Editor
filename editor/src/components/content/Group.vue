<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <div class="flex flex-col rounded-md shadow-sm shadow-game-shadow">
    <slot name="label">
      <div v-if="label" class="flex border-b-2 border-game-foreground-a p-4">
        <span class="text-xl font-semibold truncate">{{ label }}</span>
      </div>
    </slot>

    <div class="flex flex-col gap-4 p-4">
      <slot></slot>
    </div>
  </div>
</template>
