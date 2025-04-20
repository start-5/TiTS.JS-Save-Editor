import { Handler } from '#src/types/handler.js';
import { StorageItem } from '#shared/types/game/storage';

import { CallExpression } from 'acorn';
import { simple } from 'acorn-walk';

import {
  isIdentifier,
  isMemberExpression,
} from '#src/utils/ast.js';
import { log } from '#src/utils/log.js';
import {
  generateStorageItemFromName,
  processStorageItemNameFromCallExpression,
  processStorageItemArg,
  processStorageItemsResult,
} from '#src/utils/storage.js';

export const keyItemsHandler: Handler = function (data, result) {
  const keyItems: StorageItem[] = [];

  const callVariants = [
    'hasKeyItem',
    'getKeyItem',
    ...Array(4).fill(0).map(function (_, index) {
      return `keyItemv${++index}`;
    }),
    'removeKeyItem',
  ];

  const valueCallVariants = [
    'addKeyValue',
    'setKeyItemValue',
  ];

  function processFunctionName(node: CallExpression): string | null {
    const member = node.callee;
    if (!isMemberExpression(member)) {
      return null;
    }

    const _function = member.property;
    if (!isIdentifier(_function)) {
      return null;
    }

    return _function.name;
  }

  data.content.forEach(function (content) {
    simple(content.ast, {
      CallExpression(node) {
        const keyItemName = processStorageItemNameFromCallExpression(node);
        if (keyItemName === null) {
          return;
        }

        const functionName = processFunctionName(node);
        if (functionName === null) {
          return;
        }

        if (!callVariants.includes(functionName)) {
          return;
        }

        const keyItem = generateStorageItemFromName(keyItemName);

        keyItems.push(keyItem);
      },
    });

    simple(content.ast, {
      CallExpression(node) {
        const args = node.arguments;

        if (args.length !== 3) {
          return;
        }

        const keyItemName = processStorageItemNameFromCallExpression(node);
        if (keyItemName === null) {
          return;
        }

        const functionName = processFunctionName(node);
        if (functionName === null) {
          return;
        }

        if (!valueCallVariants.includes(functionName)) {
          return;
        }

        const position = processStorageItemArg<number>(args[1], 'number');
        const value = processStorageItemArg<number>(args[2], 'number');

        if (position === null || value === null) {
          return;
        }

        if (position < 1 || position > 4) {
          return;
        }

        const keyItem = generateStorageItemFromName(keyItemName);

        // @ts-expect-error
        keyItem[`value${position}`] = value;

        keyItems.push(keyItem);
      },
    });

    simple(content.ast, {
      CallExpression(node) {
        const args = node.arguments;

        if (args.length === 0) {
          return;
        }

        const keyItemName = processStorageItemNameFromCallExpression(node);
        if (keyItemName === null) {
          return;
        }

        const functionName = processFunctionName(node);
        if (functionName !== 'createKeyItem') {
          return;
        }

        const keyItem = generateStorageItemFromName(keyItemName);

        keyItem.value1 = processStorageItemArg<number>(args[1], 'number') ?? 0;
        keyItem.value2 = processStorageItemArg<number>(args[2], 'number') ?? 0;
        keyItem.value3 = processStorageItemArg<number>(args[3], 'number') ?? 0;
        keyItem.value4 = processStorageItemArg<number>(args[4], 'number') ?? 0;

        keyItem.tooltip = processStorageItemArg<string>(args[5], 'string') ?? '';

        keyItems.push(keyItem);
      },
    });
  });

  data.pantyData.forEach(function (panties) {
    const keyItem = generateStorageItemFromName(panties.panty);

    keyItems.push(keyItem);
  });

  const keyItemsResult = processStorageItemsResult(keyItems);

  log(`Generated ${keyItemsResult.length} key items`);

  result.keyItems = keyItemsResult;
};
