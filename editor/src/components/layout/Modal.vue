<script lang="ts" setup>
import { onUpdated, ref } from 'vue';

import Button from '@/components/buttons/Button.vue';

import closeIconPath from '@icons/close.svg';

defineProps<{
  label?: string;
}>();

const visible = defineModel<boolean>('visible', {
  default: false,
});

const containerVisible = ref(visible.value);

const containerElement = ref<HTMLElement>();
const containerClickElement = ref<HTMLElement>();

function close() {
  visible.value = false;
}

function afterLeave() {
  containerVisible.value = false;
}

function onContainerMouseDown(event: MouseEvent) {
  containerClickElement.value = event.target as HTMLElement;
}

function onContainerMouseUp() {
  if (containerElement.value === containerClickElement.value) {
    close();
  }
}

onUpdated(function () {
  if (visible.value) {
    containerVisible.value = visible.value;
  }
});
</script>

<template>
  <Teleport to="#modal">
    <div v-if="containerVisible" ref="containerElement" @mousedown="onContainerMouseDown" @mouseup="onContainerMouseUp"
      class="z-50 fixed w-full h-full left-0 top-0 flex items-center justify-center text-game-text font-lato transition py-4 px-4 md:px-0"
      :class="visible ? 'bg-black/25' : 'bg-transparent'">
      <Transition name="modal" appear @after-leave="afterLeave">
        <div v-if="visible" class="flex flex-col max-h-full rounded-lg bg-game-background shadow-md w-full md:w-[640px]">
          <div class="flex items-center justify-between gap-2 shrink-0 p-4">
            <p class="font-bold text-lg truncate">{{ label }}</p>

            <Button @click="close" :icon="closeIconPath" class="p-1" iconClass="size-6" />
          </div>

          <hr class="text-game-foreground-a" />

          <div class="p-4 overflow-y-auto">
            <slot></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 250ms ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  transform: scale(0);
}
</style>
