import { GAME_URL, RESULT_FILE_PATH } from './env.js';

import { GeneratorResult } from '#shared/types/generator/generator.js';

import { readFile } from 'fs/promises';
import { get } from 'https';

const URL = `${GAME_URL}/version.json`

const editorData: GeneratorResult = JSON.parse(await readFile(RESULT_FILE_PATH, 'utf-8'));

const editorBuild = editorData.build;

get(URL, function (response) {
  if (response.statusCode !== 200) {
    throw new Error(`Invalid response code: ${response.statusCode}`);
  }

  response.setEncoding('utf-8');

  let json = '';

  response.on('data', function (chunk) {
    json += chunk;
  });

  response.on('end', function () {
    const body = JSON.parse(json);

    const gameBuild = parseFloat(body.currentVersion);

    if (isNaN(gameBuild)) {
      throw new Error('Invalid response body');
    }

    if (gameBuild > editorBuild) {
      console.log(`New version available: ${gameBuild}`);
    }
    else {
      console.log(`Up to date with: ${editorBuild}`);
      process.exitCode = 1;
    }
  });
});
