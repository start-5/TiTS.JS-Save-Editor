<script setup lang="ts">
import useFileManager from '@/composables/useFileManager';

import Button from '@/components/buttons/Button.vue';

import uploadIconPath from '@icons/upload.svg';

const { browseAndLoadFile } = useFileManager();
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center gap-4">
    <img :src="uploadIconPath" class="size-16" />

    <div class="flex flex-col items-center gap-2">
      <p class="text-lg font-bold">No file loaded...</p>
      <p class="text-sm text-game-text/75">
        Press
        <Button label="Load File" @click="browseAndLoadFile" class="mx-1 px-2 py-1 inline" />
        or Drag and Drop to start editing...
      </p>
    </div>
  </div>
</template>
