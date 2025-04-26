import { Handler } from '#src/types/handler.js';

export const Version: Handler = function (data, result) {
  result.version = data.version;
  result.build = parseFloat(data.build);
};
