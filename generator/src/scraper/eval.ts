// @ts-nocheck

import { EvalResultRaw } from '#src/types/scraper.js';

type EvalFunctionProps = {

};

export const evalFunctionProps: EvalFunctionProps = {

};

export function evalFunction({ }: EvalFunctionProps): EvalResultRaw {
  // import { serialize } from '#src/utils/map.js';
  function __inject__serialize__(value) {
    return JSON.stringify(value, function (_, _value) {
      if (_value instanceof Map) {
        return {
          __instanceof__: 'Map',
          __value__: [..._value],
        };
      }

      return _value;
    });
  }

  Map.prototype.toJSON = undefined;

  window.flags = {};

  debugger;

  return {
    globals: window.GLOBAL,
    serializedColorData: __inject__serialize__(window.ColorData),
    serializedPantyData: __inject__serialize__(window.PantyData),
    version: window.version,
  };
};
