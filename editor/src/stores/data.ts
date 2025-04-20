import { reactive } from 'vue';

import data from '@/data.json';

import type { SelectOptions } from '@shared/types/editor/ui';
import type { GeneratorResult, ValidBodyPartFlagsKey, ValidBodyPartTypesKey } from '@shared/types/generator/generator';

export default reactive<GeneratorResult>(data);

export function validBodyPartTypesOptions(part: ValidBodyPartTypesKey): SelectOptions<number> {
  const values = data.valid.bodyPartTypes[part];

  return data.options.bodyPartTypes.filter(function (option) {
    return values.includes(option.value);
  });
}

export function validBodyPartFlagsOptions(part: ValidBodyPartFlagsKey): SelectOptions<number> {
  const values = data.valid.bodyPartFlags[part];

  return data.options.bodyPartFlags.filter(function (option) {
    return values.includes(option.value);
  });
}
