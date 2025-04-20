import type { Serializable } from '@shared/types/game/serializable';
import type { CharacterState } from '@/types/game/character';
import type { Ship, ShipState } from '@/types/game/ship';
import type { FlagsState } from '@/types/game/flags';

export type GameState = {
  gameBuild: string;
  gameInstanceInfo: SaveSlotState;
  debugMode: boolean;
  minutes: number;
  hours: number;
  days: number;
  characters: CharacterState;
  ships: ShipState;
  flags: FlagsState;
  inactivePlayerOwnedShips: Ship[];
} & Serializable;

export type SaveSlotState = {
  note: string;
  name: string;
  level: number;
  occupation: string;
} & Serializable;
