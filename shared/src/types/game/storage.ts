import { Serializable } from './serializable';

export type StorageItem = {
  storageName: string;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  minutesLeft: number;
  tooltip: string;
  hidden: boolean;
  combatOnly: boolean;
  iconName: string;
  iconShade: string;
} & Serializable;

export type StorageItemValueKey =
  'value1'
  | 'value2'
  | 'value3'
  | 'value4'
  | 'minutesLeft';
