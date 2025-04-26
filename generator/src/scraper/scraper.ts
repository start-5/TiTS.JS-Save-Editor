import { EVAL_DEBUG_ENABLED, GAME_URL, LOCAL_DATA_GENERATION_ENABLED } from '#src/env.js';

import { writeFileSync } from 'fs';

import puppeteer, { LaunchOptions, PageEvent } from 'puppeteer';

import { parse } from 'acorn';

import { ContentMap, EvalResult, ScraperResult } from '#src/types/scraper.js';

import { localPath } from '#src/utils/fs.js';
import { log } from '#src/utils/log.js';
import { deserialize } from '#src/utils/map.js';
import { before, stripStart } from '#src/utils/string.js';
import { track } from '#src/utils/time.js';

import { evalFunction, evalFunctionProps } from '#src/scraper/eval.js';

export default async function (): Promise<ScraperResult> {
  let result: ScraperResult = {} as ScraperResult;

  const launchOptions: LaunchOptions = {};

  if (EVAL_DEBUG_ENABLED) {
    launchOptions.devtools = true;
    launchOptions.headless = false;
  }

  const browser = await puppeteer.launch(launchOptions);

  try {
    const page = await browser.newPage();

    const contentRaw = new Map<string, string>();

    page.on(PageEvent.Response, async function (response) {
      const contentUrl = response.url();

      if (!contentUrl.endsWith('.js')) {
        return;
      }

      if (
        ['runtime', 'vendors'].some(function (str) {
          return contentUrl.includes(str)
        })
      ) {
        return;
      }

      const key = before(stripStart(contentUrl, GAME_URL), '.');
      const value = await response.text();

      contentRaw.set(key, value);

      log(`Found content ${key}`);
    });

    await track('loading game', async function () {
      await page.goto(GAME_URL);

      await page.locator('#button0').wait();
    });

    const evalResultRaw = await track('evaluating game', async function () {
      return await page.evaluate(evalFunction, evalFunctionProps);
    });

    await browser.close();

    const evalResult: EvalResult = {
      globals: evalResultRaw.globals,
      colorData: deserialize(evalResultRaw.serializedColorData),
      pantyData: deserialize(evalResultRaw.serializedPantyData),
      version: evalResultRaw.version,
      build: evalResultRaw.build,
    };

    const content: ContentMap = new Map();

    track('generating AST', function () {
      contentRaw.forEach(function (value, key) {
        content.set(key, {
          ast: parse(value, {
            ecmaVersion: 'latest',
          }),
          raw: value,
        });

        log(`Generated AST for ${key}`);

        if (LOCAL_DATA_GENERATION_ENABLED) {
          writeFileSync(localPath('content', `${key}`), value);

          log(`Generated local data for ${key}`);
        }
      });
    })

    result = {
      content,
      ...evalResult,
    };
  } catch (error) {
    await browser.close();
    throw error;
  }

  return result;
};
