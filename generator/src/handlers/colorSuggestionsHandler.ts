import { Handler } from '#src/types/handler.js';

import { log } from '#src/utils/log.js';
import { string } from '#src/utils/sort.js';

export const colorSuggestionsHandler: Handler = function (data, result) {
  const colorData = data.colorData;
  const globalsColorData = data.globals.SKIN_COLORS as Record<string, [string, string][]>;

  const colorSuggestions = new Set<string>();

  colorData.forEach(function (category) {
    category.forEach(function (_, color) {
      colorSuggestions.add(color);
    });
  });

  Object.values(globalsColorData).forEach(function (colors) {
    colors.forEach(function ([color, _]) {
      colorSuggestions.add(color);
    });
  });

  log(`Generated ${colorSuggestions.size} color suggestions`);

  result.suggestions.colors = Array.from(colorSuggestions).sort(string.asc);
};
