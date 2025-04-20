import { onMounted, onUnmounted } from 'vue';

export default function () {
  function handleError(error: Error) {
    const errorText = `Message: ${error.message}\nStacktrace: ${error.stack}`;

    console.error('Unhandled Error:', errorText);

    showErrorDialog(errorText);
  }

  async function showErrorDialog(errorText: string) {
    if (confirm(
      `An unhandled exception occurred! If you can, please open a GitHub issue so it can be fixed.\n\nSelect "OK" to copy the error to your clipboard:\n\n${errorText}`
    )) {
      try {
        await navigator.clipboard.writeText(errorText);
      } catch { }
    }
  }

  function onError(event: ErrorEvent) {
    handleError(event.error);
  }

  function onUnhandledRejection(event: PromiseRejectionEvent) {
    handleError(event.reason);
  }

  onMounted(function () {
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
  });

  onUnmounted(function () {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onUnhandledRejection);
  });
}
