import { Handler } from '#src/types/handler.js';

import { MemberExpression } from 'acorn';
import { simple } from 'acorn-walk';

import {
  isIdentifier,
  isLiteral,
  isMemberExpression,
} from '#src/utils/ast.js';
import { log } from '#src/utils/log.js';
import { string } from '#src/utils/sort.js';

export const Flags: Handler = function (data, result) {
  const flags = new Set<string>();

  function processMemberExpression(node: MemberExpression): string | null {
    if (!isIdentifier(node.object)) {
      return null;
    }

    if (node.object.name !== 'flags') {
      return null;
    }

    const property = node.property;
    if (!isLiteral(property) && !isIdentifier(property)) {
      return null;
    }

    // flags[literal]  <-------------------- junk
    if (!isLiteral(property) && node.computed) {
      return null;
    }

    const value = isLiteral(property)
      ? property.value
      : property.name;

    if (typeof value !== 'string') {
      return null;
    }

    return value;
  }

  data.content.forEach(function (content) {
    simple(content.ast, {
      // flags.key    === value
      // flags['key'] === value
      MemberExpression(node) {
        const flag = processMemberExpression(node);

        if (flag === null) {
          return;
        }

        flags.add(flag);
      },

      // flags.key    = value
      // flags['key'] = value
      AssignmentExpression(node) {
        let member: MemberExpression;

        if (isMemberExpression(node.left)) {
          member = node.left;
        }
        else if (isMemberExpression(node.right)) {
          member = node.right;
        }
        else {
          return;
        }

        const flag = processMemberExpression(member);

        if (flag === null) {
          return;
        }

        flags.add(flag);
      },

      // IncrementFlag('key')
      CallExpression(node) {
        if (node.arguments.length === 0) {
          return;
        }

        const _function = node.callee;
        if (!isIdentifier(_function)) {
          return;
        }

        if (_function.name.toLowerCase() !== 'incrementflag') {
          return;
        }

        const arg = node.arguments[0];

        if (!isLiteral(arg)) {
          return;
        }

        const flag = arg.value;

        if (typeof flag !== 'string') {
          return;
        }

        flags.add(flag);
      }
    });
  });

  const edgeCases: string[] = [
    '',
    'artistOverrides',
    'customMannequin',
    'pathOverrides',
    'savedSpreadsheets',
  ];

  edgeCases.forEach(function (flag) {
    flags.delete(flag);
  });

  log(`Generated ${flags.size} flags`);

  result.flags = Array.from(flags).sort(string.asc);
};
