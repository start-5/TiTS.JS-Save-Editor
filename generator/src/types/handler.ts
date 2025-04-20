import { GeneratorResult } from '#shared/types/generator/generator';
import { ScraperResult } from '#src/types/scraper.js';

export type Handler = (
  data: ScraperResult,
  result: GeneratorResult,
) => void;
