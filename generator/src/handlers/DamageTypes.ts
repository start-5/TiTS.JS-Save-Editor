import { Handler } from '#src/types/handler.js';
import { SelectOptions } from '#shared/types/editor/ui.js';

import { simple } from 'acorn-walk';

import {
  isArrayExpression,
  isIdentifier,
  isLiteral,
  isMemberExpression,
} from '#src/utils/ast.js';
import { log } from '#src/utils/log.js';

export const DamageTypes: Handler = function (data, result) {
  const content = data.content.get('main');

  if (content === undefined) {
    return;
  }

  const damageTypeOptions: SelectOptions<number> = [];

  // l.TypeLongNames = [...],
  simple(content.ast, {
    AssignmentExpression(node) {
      if (!isMemberExpression(node.left)) {
        return;
      }

      if (!isIdentifier(node.left.property)) {
        return;
      }

      if (node.left.property.name !== 'TypeLongNames') {
        return;
      }

      if (!isArrayExpression(node.right)) {
        return;
      }

      node.right.elements.forEach(function (element, index) {
        if (element === null) {
          return;
        }

        if (!isLiteral(element)) {
          return;
        }

        if (typeof element.value !== 'string') {
          return;
        }

        damageTypeOptions.push({
          value: index,
          label: element.value,
        });
      });
    }
  });

  log(`Generated ${damageTypeOptions.length} damage types`);

  result.options.damageTypes = damageTypeOptions;
};
