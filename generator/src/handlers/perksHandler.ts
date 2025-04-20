import { Handler } from '#src/types/handler.js';
import { StorageItem } from '#shared/types/game/storage';

import { CallExpression } from 'acorn';
import { simple } from 'acorn-walk';

import {
  isAssignmentExpression,
  isExpressionStatement,
  isIdentifier,
  isLiteral,
  isMemberExpression,
  isSequenceExpression,
} from '#src/utils/ast.js';
import { log } from '#src/utils/log.js';
import {
  generateEmptyStorageItem,
  generateStorageItemFromName,
  processStorageItemArg,
  processStorageItemNameFromCallExpression,
  processStorageItemsResult
} from '#src/utils/storage.js';

export const perksHandler: Handler = function (data, result) {
  const perks: StorageItem[] = [];

  const callVariants = [
    'hasPerk',
    'setPerkTooltip',
    'getPerkEffect',
    ...Array(4).fill(0).map(function (_, index) {
      return `perkv${++index}`;
    }),
    'removePerk',
  ];

  const valueCallVariants = [
    'addPerkValue',
    'setPerkValue',
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
        const perkName = processStorageItemNameFromCallExpression(node);
        if (perkName === null) {
          return;
        }

        const functionName = processFunctionName(node);
        if (functionName === null) {
          return;
        }

        if (!callVariants.includes(functionName)) {
          return;
        }

        const perk = generateStorageItemFromName(perkName);

        perks.push(perk);
      },
    });

    simple(content.ast, {
      CallExpression(node) {
        if (node.arguments.length !== 3) {
          return;
        }

        const perkName = processStorageItemNameFromCallExpression(node);
        if (perkName === null) {
          return;
        }

        const functionName = processFunctionName(node);
        if (functionName === null) {
          return;
        }

        if (!valueCallVariants.includes(functionName)) {
          return;
        }

        const positionArg = node.arguments[1];
        const valueArg = node.arguments[2];

        if (!isLiteral(positionArg) || !isLiteral(valueArg)) {
          return;
        }

        const position = positionArg.value;
        const value = valueArg.value;

        if (typeof position !== 'number' || typeof value !== 'number') {
          return;
        }

        if (position < 1 || position > 4) {
          return;
        }

        const perk = generateStorageItemFromName(perkName);

        // @ts-expect-error
        perk[`value${position}`] = value;

        perks.push(perk);
      },
    });

    simple(content.ast, {
      CallExpression(node) {
        const args = node.arguments;

        if (args.length === 0) {
          return;
        }

        const perkName = processStorageItemNameFromCallExpression(node);
        if (perkName === null) {
          return;
        }

        const functionName = processFunctionName(node);
        if (functionName !== 'createPerk') {
          return;
        }

        const perk = generateStorageItemFromName(perkName);

        perk.value1 = processStorageItemArg<number>(args[1], 'number') ?? 0;
        perk.value2 = processStorageItemArg<number>(args[2], 'number') ?? 0;
        perk.value3 = processStorageItemArg<number>(args[3], 'number') ?? 0;
        perk.value4 = processStorageItemArg<number>(args[4], 'number') ?? 0;

        perk.tooltip = processStorageItemArg<string>(args[5], 'string') ?? '';

        perks.push(perk);
      },
    });

    simple(content.ast, {
      FunctionDeclaration(node) {
        // function bp() {
        //   var e = new lp;
        //   e.classLimit = GLOBAL.CLASS_MERCENARY,
        //   ...
        //   e.perkName = "Perk",  <-----------------------
        // }
        if (
          !node.body.body.some(function (statement) {
            if (!isExpressionStatement(statement)) {
              return false;
            }

            if (!isSequenceExpression(statement.expression)) {
              return false;
            }

            return statement.expression.expressions.some(function (expression) {
              if (!isAssignmentExpression(expression)) {
                return false;
              }

              if (!isMemberExpression(expression.left)) {
                return false;
              }

              if (!isIdentifier(expression.left.property)) {
                return false;
              }

              return expression.left.property.name === 'perkName';
            });
          })
        ) {
          return;
        }

        node.body.body.forEach(function (statement) {
          if (!isExpressionStatement(statement)) {
            return;
          }

          const sequence = statement.expression;
          if (!isSequenceExpression(sequence)) {
            return;
          }

          const perk = generateEmptyStorageItem();

          sequence.expressions.forEach(function (expression) {
            if (!isAssignmentExpression(expression)) {
              return;
            }

            const member = expression.left;
            if (!isMemberExpression(member)) {
              return;
            }

            const property = member.property;
            if (!isIdentifier(property)) {
              return;
            }

            const valueLiteral = expression.right;
            if (!isLiteral(valueLiteral)) {
              return;
            }

            const value = valueLiteral.value;
            if (typeof value !== 'string') {
              return;
            }

            switch (property.name) {
              // e.perkName = "",  <----------- storageName
              case 'perkName':
                perk.storageName = value;
                break;

              // e.perkDescription = "",  <-------- tooltip
              case 'perkDescription':
                perk.tooltip = value;
                break;

              default:
                break;
            }
          });

          perks.push(perk);
        });
      },
    });
  });

  const perksResult = processStorageItemsResult(perks);

  log(`Generated ${perksResult.length} perks`);

  result.perks = perksResult;
};
