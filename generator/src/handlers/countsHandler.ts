import { Handler } from '#src/types/handler.js';

import { log } from '#src/utils/log.js';

export const countsHandler: Handler = function (data, result) {
  function generateCounts(value: any): any {
    if (Array.isArray(value)) {
      return value.length;
    }

    if (value !== null && typeof value === 'object') {
      const result: any = {};

      for (const key in value) {
        result[key] = generateCounts(value[key]);
      }

      return result;
    }

    return 0;
  }

  // @ts-expect-error
  result.counts = generateCounts(result);

  log('Generated counts');
};
