import { onMounted, ref } from 'vue';

import type { GameState } from '@/types/game/state';

import loader from '@/stores/loader';
import game from '@/stores/game';

const FILE_EXTENSION = '.json';

const fileName = ref<string | null>(null);
const fileNameOriginal = ref<string | null>(null);

export default function () {
  const fileInputElement = ref<HTMLInputElement | null>(null);

  function browseAndLoadFile() {
    fileInputElement.value?.click();
  };

  async function onFileChanged() {
    if (!fileInputElement.value) {
      return;
    }

    const file = fileInputElement.value.files?.[0];

    if (!file) {
      return;
    }

    fileInputElement.value.value = '';

    await loadFile(file);
  }

  async function loadFile(file: File) {
    loader.isLoading = true;

    try {
      await new Promise<void>(function (resolve) {
        const loadedFileName = file.name;

        if (!loadedFileName.endsWith(FILE_EXTENSION) || file.type !== 'application/json') {
          throw new Error(`Unsupported file extension. Please select a ${FILE_EXTENSION} file.`);
        }

        const reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
          const result = reader.result;

          if (typeof result !== 'string') {
            throw new Error(`Unsupported file format.`);
          }

          let parsed;

          try {
            parsed = JSON.parse(reader.result as string);
          } catch (error) {
            throw new Error(`Failed to parse file.\n\n ${error}`);
          }

          if (
            parsed.classInstance !== 'GameState'
            || typeof parsed.characters !== 'object'
            || typeof parsed.flags !== 'object'
          ) {
            throw new Error('The selected file is not a valid TiTS save file.');
          }

          game.state = parsed as GameState;

          fileName.value = fileNameOriginal.value = loadedFileName.replace(FILE_EXTENSION, '');

          alert('File loaded successfully, happy editing!');

          resolve();
        };

        reader.onerror = function () {
          throw new Error('Failed to read file.');
        };
      });
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      loader.isLoading = false;
    }
  }

  async function saveFile() {
    if (!game.isLoaded) {
      return;
    }

    loader.isLoading = true;

    try {
      await new Promise<void>(function (resolve) {
        // @ts-expect-error
        game.state.edited = true;

        const blob = new Blob([JSON.stringify(game.state)], { type: 'application/json' });

        const savedFileName = (fileName.value || fileNameOriginal.value || 'unnamed') + FILE_EXTENSION;

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = savedFileName;
        a.click();
        a.remove();

        resolve();
      });
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      loader.isLoading = false;
    }
  }

  onMounted(function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = FILE_EXTENSION;
    input.addEventListener('change', onFileChanged);

    fileInputElement.value = input;
  });

  return {
    browseAndLoadFile,
    loadFile,
    saveFile,
    fileName,
  };
}
