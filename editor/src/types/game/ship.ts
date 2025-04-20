import type { Serializable } from '@shared/types/game/serializable';

export type ShipState = {
  SHIP: Ship;
};

export type Ship = {
  short: string;
  long: string;
  modelDisplay: string;
  wardrobeSizeRaw: number;
  equipmentSizeRaw: number;
  consumableSizeRaw: number;
  valuablesSizeRaw: number;
  toysSizeRaw: number;
  gunCapacityRaw: number;
  capacityRaw: number;
  agilityRaw: number;
  speedRaw: number;
  powerRaw: number;
  sensorsRaw: number;
  systemsRaw: number;
  HPRaw: number;
  HPMod: number;
  shieldsRaw: number;
  energyRaw: number;
  energyMod: number;
  level: number;
  holodeck: boolean;
  credits: number;
} & Serializable;
