import { LOCAL_DATA_ENABLED, LOCAL_DATA_GENERATION_ENABLED, RESULT_FILE_PATH } from '#src/env.js';

import { readdir, readFile, writeFile } from 'fs/promises';
import { basename } from 'path';

import { GeneratorResult } from '#shared/types/generator/generator';
import { ScraperResult } from '#src/types/scraper.js';

import { localPath, mkdir } from '#src/utils/fs.js';
import { log } from '#src/utils/log.js';
import { deserialize, serialize } from '#src/utils/map.js';
import { track } from '#src/utils/time.js';

import { parse } from 'acorn';

import scrape from '#src/scraper/scraper.js';

import {
  colorSuggestionsHandler,
  countsHandler,
  flagsHandler,
  globalsHandler,
  hairStylesHandler,
  keyItemsHandler,
  perksHandler,
  statusEffectsHandler,
  validBodyPartFlagsHandler,
  validBodyPartTypesHandler,
} from '#src/handlers/index.js';

track('program', async function () {

  if (LOCAL_DATA_GENERATION_ENABLED) {
    await mkdir(localPath());
    await mkdir(localPath('content'));

    log('Generated local directories');
  }

  let data: ScraperResult | null = null;

  if (LOCAL_DATA_ENABLED) {
    await track('loading local data', async function () {
      const localScraperResult = JSON.parse(await readFile(localPath('scraper'), 'utf-8'));

      data = {
        content: new Map(),
        globals: localScraperResult.globals,
        colorData: deserialize(localScraperResult.colorData),
        pantyData: deserialize(localScraperResult.pantyData),
        version: localScraperResult.version,
      };

      const localContentFilePaths = await readdir(localPath('content'));

      for (let i = 0; i < localContentFilePaths.length; i++) {
        const filePath = localContentFilePaths[i];

        const fileContent = await readFile(localPath('content', filePath), 'utf-8');

        data.content.set(basename(filePath), {
          ast: parse(fileContent, {
            ecmaVersion: 'latest',
          }),
          raw: fileContent,
        })
      }
    })
  }
  else {
    data = await scrape();

    if (LOCAL_DATA_GENERATION_ENABLED) {
      await writeFile(localPath('scraper'), JSON.stringify({
        globals: data.globals,
        colorData: serialize(data.colorData),
        pantyData: serialize(data.pantyData),
        version: data.version,
      }));

      log('Generated local scraper data');
    }
  }

  const result: GeneratorResult = {
    flags: [],
    options: {
      beardStyles: [],
      bodyPartFlags: [],
      bodyPartTypes: [],
      classes: [],
      fluidTypes: [],
      genitalSpots: [],
      hairStyles: [],
      hairTypes: [],
      nippleTypes: [],
      sexPrefs: [],
      skinTypes: [],
      upbringings: [],
    },
    suggestions: {
      colors: [],
    },
    valid: {
      bodyPartFlags: {
        areola: [],
        arm: [],
        ass: [],
        crotch: [],
        cock: [],
        ear: [],
        face: [],
        leg: [],
        skin: [],
        tail: [],
        tongue: [],
        vagina: [],
      },
      bodyPartTypes: {
        antennae: [],
        arm: [],
        cock: [],
        ear: [],
        eye: [],
        face: [],
        horn: [],
        leg: [],
        tail: [],
        tongue: [],
        vagina: [],
        wing: [],
      },
    },
    keyItems: [],
    perks: [],
    statusEffects: [],
  };

  const handlers = [
    globalsHandler,

    flagsHandler,

    colorSuggestionsHandler,

    hairStylesHandler,

    validBodyPartFlagsHandler,
    validBodyPartTypesHandler,

    keyItemsHandler,
    perksHandler,
    statusEffectsHandler,

    countsHandler,
  ];

  handlers.forEach(function (handler) {
    track(handler.name, function () {
      handler(data!, result);
    });
  });

  await writeFile(RESULT_FILE_PATH, JSON.stringify(result, null, 2));

  log(`Generated result file at ${RESULT_FILE_PATH}`);

});
