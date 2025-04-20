import type { Serializable } from '@shared/types/game/serializable';

export type Cock = {
  cLengthRaw: number;
  cLengthMod: number;
  cThicknessRatioRaw: number;
  cThicknessRatioMod: number;
  cType: number;
  cockColor: string;
  knotMultiplier: number;
  flaccidMultiplier: number;
  virgin: boolean;
  flags: number[];
  // piercing: null; // FIXME
  // cocksock: null; // FIXME
} & Serializable;

export type Vagina = {
  type: number;
  hymen: boolean;
  clits: number;
  vaginaColor: string;
  wetnessRaw: number;
  wetnessMod: number;
  loosenessRaw: number;
  loosenessMod: number;
  minLooseness: number;
  bonusCapacity: number;
  shrinkCounter: number;
  flags: number[];
  fullness: number;
  // piercing: null; // FIXME
  // clitPiercing: null; // FIXME
} & Serializable;

export type BreastRow = {
  breasts: number;
  nippleType: number;
  areolaFlags: number[];
  breastRatingRaw: number;
  breastRatingMod: number;
  breastRatingLactationMod: number;
  breastRatingHoneypotMod: number;
  fullness: number;
  // piercing: null; // FIXME
} & Serializable;
