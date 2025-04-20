import { computed, onMounted, onUnmounted, ref } from 'vue';

import useFileManager from '@/composables/useFileManager';

export default function () {
  const { loadFile } = useFileManager();

  const dragCount = ref(0);

  const isDragging = computed(function () {
    return dragCount.value > 0;
  })

  function onDragEnter(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();

    dragCount.value++;
  }

  function onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  function onDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();

    dragCount.value--;
  }

  async function onDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();

    dragCount.value = 0;

    const file = event.dataTransfer?.files?.[0];

    if (!file) {
      return;
    }

    await loadFile(file);
  }

  onMounted(function () {
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);
  });

  onUnmounted(function () {
    window.removeEventListener('dragenter', onDragEnter);
    window.removeEventListener('dragover', onDragOver);
    window.removeEventListener('dragleave', onDragLeave);
    window.removeEventListener('drop', onDrop);
  });

  return {
    isDragging,
  };
}
