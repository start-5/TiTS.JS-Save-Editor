import { Handler } from '#src/types/handler.js';

export const versionHandler: Handler = function (data, result) {
  result.version = data.version;
  result.build = data.build;
};
