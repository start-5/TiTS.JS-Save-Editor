import { join } from 'path';

import { rootPath } from '#src/utils/fs.js';

export const EVAL_DEBUG_ENABLED = false;

export const GAME_URL = 'https://www.fenoxo.com/play/TiTS/release/';

export const LOCAL_DATA_ENABLED = false;
export const LOCAL_DATA_GENERATION_ENABLED = true;

export const RESULT_FILE_PATH = join(rootPath(), '..', 'editor', 'src', 'data.json');

export default {
  EVAL_DEBUG_ENABLED,

  GAME_URL,

  LOCAL_DATA_ENABLED,
  LOCAL_DATA_GENERATION_ENABLED,
};
