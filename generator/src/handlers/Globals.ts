import { Handler } from '#src/types/handler.js';
import { SelectOptions, SelectOptionValue } from '#shared/types/editor/ui';

import { log } from '#src/utils/log.js';
import { titleCase } from '#src/utils/string.js';

type NameMap = Record<string, string | undefined>;

export const Globals: Handler = function (data, result) {
  const globals = data.globals;

  function isNameMap(value: any): value is NameMap {
    return value !== null
      && typeof value === 'object'
      && Object.values(value).every(function (value) {
        return typeof value === 'string'
      });
  }

  const edgeCases: Record<string, string[] | undefined> = {
    'FLAG_': [
      'FLAG_USED',
      'FLAG_GOO_COCK',
      'FLAG_GOO_CUNT',
      'FLAG_GOO_LEGS',
      'FLAG_GOO_ARMS',
      'FLAG_GOO_TONE',
      'FLAG_COCK_GRIFFIN',
    ],
    'TYPE_': [
      'TYPE_CENTAUR',
      'TYPE_MAX',
    ],
    'FLUID_TYPE_': [
      'FLUID_TYPE_SHORT',
    ],
    'SEXPREF_': [
      'SEXPREF_VALUES',
    ],
  };

  function generateOptions<T extends SelectOptionValue>(prefix: string, nameMapKey = 'NAMES'): SelectOptions<T> {
    const options: SelectOptions<T> = [];

    let nameMap: NameMap | null = null;

    const nameMapCandidate = globals[`${prefix}${nameMapKey}`];

    if (isNameMap(nameMapCandidate)) {
      nameMap = nameMapCandidate;
    }
    else {
      log(`Name map not found for ${prefix}. Will use fallback.`);
    }

    Object.keys(globals)
      .filter(function (key) {
        return key.startsWith(prefix);
      })
      .filter(function (key) {
        return key !== `${prefix}${nameMapKey}`;
      })
      .forEach(function (key) {
        if (edgeCases[prefix]?.includes(key)) {
          return;
        }

        const value = globals[key] as T;
        let label = '';

        if (
          options.some(function (option) {
            return option.value === value;
          })
        ) {
          return;
        }

        if (nameMap !== null) {
          label = nameMap[value] ?? '';
        }

        if (label === '') {
          label = titleCase(key.slice(prefix.length));
        }

        options.push({
          value,
          label,
        });
      });

    log(`Generated ${options.length} options for ${prefix}`);

    return options;
  }

  result.options.bodyPartFlags = generateOptions('FLAG_');
  result.options.bodyPartTypes = generateOptions('TYPE_');
  result.options.classes = generateOptions('CLASS_');
  result.options.fluidTypes = generateOptions('FLUID_TYPE_');
  result.options.genitalSpots = generateOptions('GENITAL_SPOT_');
  result.options.hairTypes = generateOptions('HAIR_TYPE_');
  result.options.nippleTypes = generateOptions('NIPPLE_TYPE_');
  result.options.sexPrefs = generateOptions('SEXPREF_', 'DESCRIPTORS');
  result.options.skinTypes = generateOptions('SKIN_TYPE_');
  result.options.upbringings = generateOptions('UPBRINGING_');
};
