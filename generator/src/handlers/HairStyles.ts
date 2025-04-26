import { Handler } from '#src/types/handler.js';
import { SelectOptions } from '#shared/types/editor/ui';

import { ancestor } from 'acorn-walk';

import {
  isAssignmentExpression,
  isExpressionStatement,
  isIdentifier,
  isLiteral,
  isObjectExpression,
  isProperty,
  isSequenceExpression,
  isSwitchStatement,
} from '#src/utils/ast.js';
import { log } from '#src/utils/log.js';
import { titleCase } from '#src/utils/string.js';

export const HairStyles: Handler = function (data, result) {
  const content = data.content.get('main');

  if (content === undefined) {
    return;
  }

  const beardStyleOptions: SelectOptions<number> = [];
  const hairStyleOptions: SelectOptions<string> = [];

  // switch (this.beardStyle) {
  //   case 1:  <-------------------------- value
  //       t = "braided",  <--------------- label
  //       e && ...;
  //       break;
  // }
  ancestor(content.ast, {
    FunctionExpression(node, _, ancestors) {

      // {
      //   key: "beardStyles",  <----------------
      //   value: function() {
      //     switch (this.beardStyle) {}
      //   }
      // }
      const ancestorMember = ancestors[ancestors.length - 3];
      if (!isObjectExpression(ancestorMember)) {
        return;
      }

      for (let i = 0; i < ancestorMember.properties.length; i++) {
        const ancestorProperty = ancestorMember.properties[i];
        if (!isProperty(ancestorProperty)) {
          return;
        }

        const ancestorLiteral = ancestorProperty.value;
        if (!isLiteral(ancestorLiteral)) {
          return;
        }

        if (ancestorLiteral.value !== 'beardStyles') {
          return;
        }

        break;
      }

      node.body.body.forEach(function (statement) {
        // function() {
        //   var e = arguments.length > 0 ...
        //     , t = "";
        //   switch (this.beardStyle) {  <-------
        //     ...
        //   }
        // }
        if (!isSwitchStatement(statement)) {
          return;
        }

        statement.cases.forEach(function (switchCase) {

          let value: number | null = null;
          let label: string | null = null;

          const test = switchCase.test;

          // switch (this.beardStyle) {
          //   default:  <----------------- value
          //     ...
          //   case 1:  <------------------ value
          //     ...  
          // }
          if (test == null) {
            value = 0; // default case
          }
          else {
            if (!isLiteral(test)) {
              return;
            }

            if (typeof test.value !== 'number') {
              return;
            }

            value = test.value;
          }

          switchCase.consequent.forEach(function (statement) {
            if (!isExpressionStatement(statement)) {
              return;
            }

            let expression = statement.expression;

            // switch (this.beardStyle) {
            //   default:
            //     t = "unstyled",  <------ label
            //     e && (t += " beard");  <- junk
            //     break;
            // }

            if (isSequenceExpression(expression)) {
              expression = expression.expressions[0];
            }

            if (!isAssignmentExpression(expression)) {
              return;
            }

            const expressionRightLiteral = expression.right;
            if (!isLiteral(expressionRightLiteral)) {
              return;
            }

            if (typeof expressionRightLiteral.value !== 'string') {
              return;
            }

            label = expressionRightLiteral.value;
          });

          if (label === null) {
            return;
          }

          beardStyleOptions.push({
            value,
            label: titleCase(label),
          });
        });
      });
    }
  });

  // {
  //   straight: {  <---------------------- value
  //     hairBtn: "Straight",  <----------- label
  //   },
  // },
  ancestor(content.ast, {
    ObjectExpression(node, _, ancestors) {

      let label: string | null = null;

      // {
      //   straight: {
      //     hairBtn: "Straight",  <------- label
      //   },
      // },
      for (let i = 0; i < node.properties.length; i++) {
        const property = node.properties[i];
        if (!isProperty(property)) {
          continue;
        }

        const key = property.key;
        if (!isIdentifier(key)) {
          continue;
        }

        if (key.name !== 'hairBtn') {
          continue;
        }

        const valueLiteral = property.value;
        if (!isLiteral(valueLiteral)) {
          continue;
        }

        const value = valueLiteral.value;
        if (typeof value !== 'string') {
          continue;
        }

        label = value;
        break;
      }

      if (label === null) {
        return;
      }

      // {
      //   straight: {  <------------------ value
      //     hairBtn: "Straight",  
      //   },
      // },
      const ancestorProperty = ancestors[ancestors.length - 2];
      if (!isProperty(ancestorProperty)) {
        return;
      }

      const ancestorKey = ancestorProperty.key;
      if (!isIdentifier(ancestorKey) && !isLiteral(ancestorKey)) {
        return;
      }

      const value = isIdentifier(ancestorKey)
        ? ancestorKey.name
        : ancestorKey.value;

      if (typeof value !== 'string') {
        return;
      }

      hairStyleOptions.push({
        value,
        label,
      });
    }
  });

  hairStyleOptions.push({
    value: 'null',
    label: 'Unstyled',
  });

  log(`Generated ${beardStyleOptions.length} beard styles`);
  log(`Generated ${hairStyleOptions.length} hair styles`);

  result.options.beardStyles = beardStyleOptions;
  result.options.hairStyles = hairStyleOptions;
};
