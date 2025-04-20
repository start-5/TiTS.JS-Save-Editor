import { StorageItem, StorageItemValueKey } from '#shared/types/game/storage';

import { CallExpression, Node } from 'acorn';

import { groupBy, median, unique } from '#src/utils/array.js';
import { isLiteral } from '#src/utils/ast.js';
import { string, stringLength } from '#src/utils/sort.js';

export const ICON_SHADE_DEFAULT = 'var(--textColor)';

export function generateEmptyStorageItem(): StorageItem {
  return {
    classInstance: 'StorageClass',
    neverSerialize: false,
    version: 1,

    storageName: '',

    value1: 0,
    value2: 0,
    value3: 0,
    value4: 0,

    minutesLeft: 0,

    tooltip: '',

    hidden: false,
    combatOnly: false,

    iconName: '',
    iconShade: ICON_SHADE_DEFAULT,
  };
}

export function generateStorageItemFromName(name: string): StorageItem {
  const item = generateEmptyStorageItem();

  item.storageName = name;

  return item;
}

export function processStorageItemNameFromCallExpression(node: CallExpression): string | null {
  const arg = node.arguments[0];

  if (!isLiteral(arg)) {
    return null;
  }

  const name = arg.value;
  if (typeof name !== 'string') {
    return null;
  }

  return name;
}

export function processStorageItemArg<T extends boolean | number | string>(node: Node, type: 'boolean' | 'number' | 'string'): T | null {
  if (!isLiteral(node)) {
    return null;
  }

  const prop = node.value;
  if (typeof prop !== type) {
    return null;
  }

  return prop as T;
}

export function processStorageItemsMedian(items: StorageItem[], key: StorageItemValueKey) {
  const values = items
    .map(function (item) {
      return item[key];
    })
    .filter(function (value) {
      return value !== 0;
    });

  if (values.length === 0) {
    return 0;
  }

  return median(unique(values));
}

export function processStorageItemsResult(items: StorageItem[]) {
  const result: StorageItem[] = [];

  groupBy(items, function (item) {
    return item.storageName;
  }).forEach(function (items, name) {
    const item = generateStorageItemFromName(name);

    item.value1 = processStorageItemsMedian(items, 'value1');
    item.value2 = processStorageItemsMedian(items, 'value2');
    item.value3 = processStorageItemsMedian(items, 'value3');
    item.value4 = processStorageItemsMedian(items, 'value4');

    item.minutesLeft = processStorageItemsMedian(items, 'minutesLeft');

    item.tooltip = items
      .map(function (item) {
        return item.tooltip;
      })
      .sort(stringLength.desc)[0];

    item.hidden = items
      .some(function (item) {
        return item.hidden;
      });

    item.combatOnly = items
      .some(function (item) {
        return item.combatOnly;
      });

    item.iconName = items
      .map(function (item) {
        return item.iconName;
      })
      .sort(string.desc)[0];

    item.iconShade = items
      .map(function (item) {
        return item.iconShade;
      })
      .filter(function (icon) {
        return icon !== ICON_SHADE_DEFAULT;
      })
      .sort(string.desc)[0] ?? ICON_SHADE_DEFAULT;

    result.push(item);
  });

  return result.sort(function (a, b) {
    return string.asc(a.storageName, b.storageName);
  });
}
