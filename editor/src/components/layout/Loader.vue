<script setup lang="ts">
import loader from '@/stores/loader';

import FadeTransition from '@/components/transitions/FadeTransition.vue';
</script>

<template>
  <FadeTransition>
    <div v-if="loader.isLoading" class="fixed inset-0 bg-black/25 flex items-center justify-center z-10">
      <div class="animate-spin w-10 h-10 border-4 border-game-highlight border-t-transparent rounded-full"></div>
    </div>
  </FadeTransition>
</template>
