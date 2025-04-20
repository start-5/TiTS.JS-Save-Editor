<script setup lang="ts" generic="T">
import { computed } from 'vue';

import FadeTransition from '@/components/transitions/FadeTransition.vue';

const model = defineModel<boolean | T[]>();

const props = defineProps<{
  label?: string;
  value?: T;
}>();

const isChecked = computed(function () {
  if (model.value === undefined) {
    return false;
  }

  if (Array.isArray(model.value)) {
    return model.value.includes(props.value!);
  }

  return model.value === true;
});
</script>

<template>
  <label class="w-fit flex items-center gap-2 cursor-pointer group">
    <div class="relative">
      <input v-model="model" :value type="checkbox" class="sr-only peer">

      <div
        class="w-12 h-7 rounded-full border-2 peer-focus:ring-2 peer-focus:ring-game-focus transition"
        :class="isChecked ? 'bg-game-highlight border-game-highlight' : 'bg-game-shadow/20 group-hover:bg-game-foreground-a border-game-foreground-a'">
      </div>

      <div class="absolute bg-white size-5 left-1 top-1 rounded-full transition" :class="{ 'translate-x-full': isChecked }">
        <FadeTransition>
          <svg v-if="isChecked" class="fill-game-highlight" viewBox="0 -960 960 960">
            <path d="m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z" />
          </svg>
        </FadeTransition>
      </div>
    </div>

    <span v-if="label">
      {{ label }}
    </span>
  </label>
</template>
