export type SettingValue = boolean | number | string;

export enum SettingKey {
  MENU_SHOW_ON_PAGE_LOAD = 'menu.show-on-page-load',
};

export type Setting = {
  key: SettingKey;
  name: string;
  description?: string;
  default: SettingValue;
};

export type SettingStore = {
  settings: Setting[];
  state: Map<SettingKey, SettingValue>;
};
