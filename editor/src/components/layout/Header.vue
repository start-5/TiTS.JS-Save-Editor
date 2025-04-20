<script setup lang="ts">
import { ref } from 'vue';

import useFileManager from '@/composables/useFileManager';

import game from '@/stores/game';

import Button from '@/components/buttons/Button.vue';
import String from '@/components/forms/String.vue';

import downIconPath from '@icons/down.svg';
import downloadIconPath from '@icons/download.svg';
import menuIconPath from '@icons/menu.svg';
import upIconPath from '@icons/up.svg';
import uploadIconPath from '@icons/upload.svg';

const isCollapsed = ref(false);

const { browseAndLoadFile, saveFile, fileName } = useFileManager();

function toggleIsCollapsed() {
  isCollapsed.value = !isCollapsed.value;
}

function onLoadFileClicked() {
  browseAndLoadFile();
}

async function onSaveFileClicked() {
  await saveFile();
}
</script>

<template>
  <header class="rounded-b-md shadow-sm shadow-game-shadow shrink-0">

    <div class="overflow-hidden transition-all" :class="isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px]'">
      <div class="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4">

        <div class="flex flex-1 gap-3 md:gap-4">
          <!-- <Button :icon="menuIconPath" icon-class="size-6" /> FIXME -->

          <String v-model="fileName" class="flex-1" input-class="h-[40px]" />
        </div>

        <div class="flex justify-center gap-3 md:gap-4">
          <Button label="Load File" :icon="uploadIconPath" icon-class="size-6" @click="onLoadFileClicked" />
          <Button label="Save File" :icon="downloadIconPath" icon-class="size-6" @click="onSaveFileClicked" :disabled="!game.isLoaded" />
        </div>

      </div>
    </div>

    <div class="absolute w-full flex justify-center pointer-events-none">
      <Button :icon="isCollapsed ? downIconPath : upIconPath" @click="toggleIsCollapsed" class="rounded-t-none px-3 py-1 pointer-events-auto opacity-50 hover:opacity-100" icon-class="size-8" />
    </div>

  </header>
</template>
