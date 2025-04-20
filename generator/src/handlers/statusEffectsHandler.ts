import { Handler } from '#src/types/handler.js';
import { StorageItem } from '#shared/types/game/storage';

import { CallExpression } from 'acorn';
import { simple } from 'acorn-walk';

import {
  isIdentifier,
  isMemberExpression,
  isObjectExpression,
  isProperty,
} from '#src/utils/ast.js';
import { log } from '#src/utils/log.js';
import {
  generateEmptyStorageItem,
  generateStorageItemFromName,
  processStorageItemNameFromCallExpression,
  processStorageItemArg,
  processStorageItemsResult,
  ICON_SHADE_DEFAULT
} from '#src/utils/storage.js';

export const statusEffectsHandler: Handler = function (data, result) {
  const statusEffects: StorageItem[] = [];

  const callVariants = [
    'hasStatusEffect',
    'hasSharedStatusEffect',
    'hasCombatStatusEffect',
    'getStatusEffect',
    ...Array(4).fill(0).map(function (_, index) {
      return `statusEffectv${++index}`;
    }),
    'getStatusMinutes',
    'getStatusTooltip',
    'setStatusTooltip',
    'setStatusIconShade',
    'isStatusHidden',
    'setStatusHidden',
    'showStatusEffect',
    'hideStatusEffect',
    'toggleStatusHidden',
    'removeStatusEffect',
  ];

  const valueCallVariants = [
    'addStatusValue',
    'setStatusValue',
  ];

  const minutesLeftCallVariants = [
    'addStatusMinutes',
    'setStatusMinutes',
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
        const statusEffectName = processStorageItemNameFromCallExpression(node);
        if (statusEffectName === null) {
          return;
        }

        const functionName = processFunctionName(node);
        if (functionName === null) {
          return;
        }

        if (!callVariants.includes(functionName)) {
          return;
        }

        const statusEffect = generateStorageItemFromName(statusEffectName);

        statusEffects.push(statusEffect);
      },
    });

    simple(content.ast, {
      CallExpression(node) {
        const args = node.arguments;

        if (args.length !== 3) {
          return;
        }

        const statusEffectName = processStorageItemNameFromCallExpression(node);
        if (statusEffectName === null) {
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

        const statusEffect = generateStorageItemFromName(statusEffectName);

        // @ts-expect-error
        statusEffect[`value${position}`] = value;

        statusEffects.push(statusEffect);
      },
    });

    simple(content.ast, {
      CallExpression(node) {
        const args = node.arguments;

        if (args.length !== 3) {
          return;
        }

        const statusEffectName = processStorageItemNameFromCallExpression(node);
        if (statusEffectName === null) {
          return;
        }

        const functionName = processFunctionName(node);
        if (functionName === null) {
          return;
        }

        if (!minutesLeftCallVariants.includes(functionName)) {
          return;
        }

        const minutesLeft = processStorageItemArg<number>(args[1], 'number');

        if (minutesLeft === null) {
          return;
        }

        const statusEffect = generateStorageItemFromName(statusEffectName);

        statusEffect.minutesLeft = minutesLeft;

        statusEffects.push(statusEffect);
      },
    });

    simple(content.ast, {
      CallExpression(node) {
        const args = node.arguments;

        if (args.length === 0) {
          return;
        }

        const statusEffectName = processStorageItemNameFromCallExpression(node);
        if (statusEffectName === null) {
          return;
        }

        const functionName = processFunctionName(node);
        if (functionName !== 'createStatusEffect') {
          return;
        }

        const statusEffect = generateStorageItemFromName(statusEffectName);

        statusEffect.value1 = processStorageItemArg<number>(args[1], 'number') ?? 0;
        statusEffect.value2 = processStorageItemArg<number>(args[2], 'number') ?? 0;
        statusEffect.value3 = processStorageItemArg<number>(args[3], 'number') ?? 0;
        statusEffect.value4 = processStorageItemArg<number>(args[4], 'number') ?? 0;

        statusEffect.minutesLeft = processStorageItemArg<number>(args[9], 'number') ?? 0;

        statusEffect.tooltip = processStorageItemArg<string>(args[7], 'string') ?? '';
        statusEffect.combatOnly = processStorageItemArg<boolean>(args[8], 'boolean') ?? false;

        statusEffect.hidden = processStorageItemArg<boolean>(args[5], 'boolean') ?? false;

        statusEffect.iconName = processStorageItemArg<string>(args[6], 'string') ?? '';

        const iconShadeArg = args[10];
        let iconShade = processStorageItemArg<string>(iconShadeArg, 'string');

        if (iconShade === null) {
          if (isMemberExpression(iconShadeArg)) {
            if (isIdentifier(iconShadeArg.object) && isIdentifier(iconShadeArg.property)) {
              if (iconShadeArg.object.name === 'GLOBAL') {
                iconShade = data.globals[iconShadeArg.property.name] as string;
              }
            }
          }
        }

        statusEffect.iconShade = iconShade ?? ICON_SHADE_DEFAULT;

        statusEffects.push(statusEffect);
      },
    });

    simple(content.ast, {
      CallExpression(node) {
        const object = node.arguments[0];

        if (!isObjectExpression(object)) {
          return;
        }

        const functionName = processFunctionName(node);
        if (functionName !== 'createStatus') {
          return;
        }

        const statusEffect = generateEmptyStorageItem();


        object.properties.forEach(function (property) {
          if (!isProperty(property)) {
            return;
          }

          const key = property.key;
          if (!isIdentifier(key)) {
            return;
          }

          switch (key.name) {
            case 'statusName':
              statusEffect.storageName = processStorageItemArg<string>(property.value, 'string') ?? '';
              break;

            case 'value1':
            case 'value2':
            case 'value3':
            case 'value4':
            case 'minutesLeft':
              statusEffect[key.name] = processStorageItemArg<number>(property.value, 'number') ?? 0;
              break;

            case 'hidden':
            case 'combatOnly':
              statusEffect[key.name] = processStorageItemArg<boolean>(property.value, 'boolean') ?? false;
              break;

            case 'iconName':
              statusEffect.iconName = processStorageItemArg<string>(property.value, 'string') ?? '';
              break;

            case 'iconShade':
              let iconShade = processStorageItemArg<string>(property.value, 'string');

              if (iconShade === null) {
                const member = property.value;

                if (isMemberExpression(member)) {
                  if (isIdentifier(member.object) && isIdentifier(member.property)) {
                    if (member.object.name === 'GLOBAL') {
                      iconShade = data.globals[member.property.name] as string;
                    }
                  }
                }
              }

              statusEffect.iconShade = iconShade ?? ICON_SHADE_DEFAULT;
              break;

            default:
              break;
          }
        });

        if (statusEffect.storageName === '') {
          return;
        }

        statusEffects.push(statusEffect);
      },
    });
  });

  const statusEffectsResult = processStorageItemsResult(statusEffects);

  log(`Generated ${statusEffectsResult.length} status effects`);

  result.statusEffects = statusEffectsResult;
};
