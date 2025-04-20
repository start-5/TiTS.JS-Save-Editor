import { reactive, watch } from 'vue';

import { SettingKey, type Setting, type SettingStore, type SettingValue } from '@/types/stores/settings';

const STORAGE_KEY = 'settings';

const settings: Setting[] = [
  {
    key: SettingKey.MENU_SHOW_ON_PAGE_LOAD,
    name: 'Show menu on page load',
    description: 'Whether to show the main menu every time the page loads.',
    default: true,
  },
];

const settingKeys = Object
  .values(SettingKey)
  .map(function (key) {
    return key.toString()
  });

function isSettingKey(value: string): value is SettingKey {
  return settingKeys.includes(value);
}

function isSettingValue(value: unknown): value is SettingValue {
  return typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string';
}

const defaultState = new Map<SettingKey, SettingValue>();

const storedSettings = localStorage.getItem(STORAGE_KEY);

if (storedSettings) {
  try {
    const parsedSettings = JSON.parse(storedSettings);

    if (typeof parsedSettings !== 'object') {
      throw new Error();
    }

    for (const [key, value] of Object.entries(parsedSettings)) {
      if (!isSettingKey(key)) {
        continue;
      }

      if (defaultState.has(key)) {
        continue;
      }

      if (!isSettingValue(value)) {
        continue;
      }

      defaultState.set(key, value);
    }
  } catch (error) {
    console.warn('Error parsing settings', error);
  }
}

settings.forEach(function (setting) {
  if (!defaultState.has(setting.key)) {
    defaultState.set(setting.key, setting.default);
  }
});

const store = reactive<SettingStore>({
  settings,
  state: defaultState,
});

watch(store.state, function (state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(state)));
});

function getSettingValue(key: SettingKey): SettingValue {
  return store.state.get(key)!;
};

function setSettingValue(key: SettingKey, value: SettingValue) {
  store.state.set(key, value);
};

function resetSettings() {
  settings.forEach(function (setting) {
    setSettingValue(setting.key, setting.default);
  });
};

export default function useSettingsStore() {
  return {
    getSettingValue,
    setSettingValue,
    resetSettings,
  };
};
