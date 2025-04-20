<script setup lang="ts">
import useExceptionHandler from '@/composables/useExceptionHandler';
import useDragAndDropFileManager from '@/composables/useDragAndDropFileManager';

import Header from '@/components/layout/Header.vue';
import Content from './components/layout/Content.vue';
import Loader from '@/components/layout/Loader.vue';
import FadeTransition from '@/components/transitions/FadeTransition.vue';

import uploadIconPath from '@icons/upload.svg';

useExceptionHandler();

const { isDragging } = useDragAndDropFileManager();
</script>

<template>
  <div class="absolute left-0 top-0 right-0 bottom-0 flex flex-col gap-6 bg-game-background text-game-text font-lato">
    <Header />

    <Content />

    <FadeTransition>
      <div v-if="isDragging" class="w-full h-full fixed inset-0 bg-black/25 z-10 flex items-center justify-center border-4 border-dashed border-game-focus rounded-lg">
        <div class="flex items-center gap-2 px-3 py-2 rounded-md bg-game-foreground-a">
          <span class="font-bold">Load File</span>
          <img :src="uploadIconPath" class="size-6" />
        </div>
      </div>
    </FadeTransition>

    <Loader />
  </div>
</template>
