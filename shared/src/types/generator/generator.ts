import { SelectOptions } from '../editor/ui';
import { StorageItem } from '../game/storage';

export type GeneratorResult = {
  flags: string[],
  options: {
    beardStyles: SelectOptions<number>;
    bodyPartFlags: SelectOptions<number>;
    bodyPartTypes: SelectOptions<number>;
    classes: SelectOptions<number>;
    fluidTypes: SelectOptions<number>;
    genitalSpots: SelectOptions<number>;
    hairStyles: SelectOptions<string>;
    hairTypes: SelectOptions<number>;
    nippleTypes: SelectOptions<number>;
    sexPrefs: SelectOptions<number>;
    skinTypes: SelectOptions<number>;
    upbringings: SelectOptions<number>;
  };
  suggestions: {
    colors: string[];
  };
  valid: {
    bodyPartFlags: {
      areola: number[];
      arm: number[];
      ass: number[];
      crotch: number[];
      cock: number[];
      ear: number[];
      face: number[];
      leg: number[];
      skin: number[];
      tail: number[];
      tongue: number[];
      vagina: number[];
    };
    bodyPartTypes: {
      antennae: number[];
      arm: number[];
      cock: number[];
      ear: number[];
      eye: number[];
      face: number[];
      horn: number[];
      leg: number[];
      tail: number[];
      tongue: number[];
      vagina: number[];
      wing: number[];
    };
  };
  keyItems: StorageItem[];
  perks: StorageItem[];
  statusEffects: StorageItem[];
};

export type ValidBodyPartFlagsKey = keyof GeneratorResult['valid']['bodyPartFlags'];
export type ValidBodyPartTypesKey = keyof GeneratorResult['valid']['bodyPartTypes'];
