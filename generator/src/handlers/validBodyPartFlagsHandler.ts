import { Handler } from '#src/types/handler.js';
import { ValidBodyPartFlagsKey } from '#shared/types/generator/generator';

import { Node } from 'acorn';
import { simple } from 'acorn-walk';

import {
  isArrayExpression,
  isIdentifier,
  isMemberExpression,
} from '#src/utils/ast.js';
import { wrap } from '#src/utils/array.js';
import { log } from '#src/utils/log.js';
import { number } from '#src/utils/sort.js';

type BodyPartItem = {
  assignmentVariants: string[];
  callVariants: string[];
  flags: Set<string>;
};

type ArrayLikeBodyPartItem = {
  callVariants: string[];
  name: string;
};

export const validBodyPartFlagsHandler: Handler = function (data, result) {
  function generateAssignmentVariants(part: string): string[] {
    return [
      `${part}Flags`,
    ];
  }

  function generateCallVariants(part: string): string[] {
    return [
      `has${part}Flag`,
      `add${part}Flag`,
      `del${part}Flag`,
      `delete${part}Flag`,
      `rem${part}Flag`,
      `remove${part}Flag`,
    ];
  }

  function generateBodyPartItem(assignmentVariants: string | string[], callVariants: string | string[]): BodyPartItem {
    return {
      assignmentVariants: wrap(assignmentVariants).map(generateAssignmentVariants).flat(),
      callVariants: wrap(callVariants).map(generateCallVariants).flat(),
      flags: new Set<string>(),
    };
  }

  function generateArrayLikeBodyPartItem(name: string): ArrayLikeBodyPartItem {
    return {
      callVariants: generateCallVariants(''),
      name,
    };
  }

  const bodyParts = new Map<ValidBodyPartFlagsKey, BodyPartItem>([
    ['areola', generateBodyPartItem('areola', 'Areola')],
    ['arm', generateBodyPartItem('arm', 'Arm')],
    ['ass', generateBodyPartItem('ass', [])],
    ['crotch', generateBodyPartItem('crotch', 'Crotch')],
    ['cock', generateBodyPartItem('cock', ['Cock', 'ACock'])],
    ['ear', generateBodyPartItem('ear', 'Ear')],
    ['face', generateBodyPartItem('face', 'Face')],
    ['leg', generateBodyPartItem('leg', 'Leg')],
    ['skin', generateBodyPartItem('skin', 'Skin')],
    ['tail', generateBodyPartItem('tail', 'Tail')],
    ['tongue', generateBodyPartItem('tongue', 'Tongue')],
    ['vagina', generateBodyPartItem('vagina', ['Vagina', 'AVagina'])],
  ]);

  const arrayLikeBodyParts = new Map<ValidBodyPartFlagsKey, ArrayLikeBodyPartItem>([
    ['cock', generateArrayLikeBodyPartItem('cocks')],
    ['vagina', generateArrayLikeBodyPartItem('vaginas')],
  ]);

  const assCallVariants = generateCallVariants('');

  function processFlag(node: Node): string | null {
    // literal  <--------------------------- junk
    // GLOBAL.FLAG  <------------------------- ok
    if (!isMemberExpression(node)) {
      return null;
    }

    const left = node.object;
    if (!isIdentifier(left)) {
      return null;
    }

    if (left.name !== 'GLOBAL') {
      return null;
    }

    const right = node.property;
    if (!isIdentifier(right)) {
      return null;
    }

    const flag = right.name;

    // GLOBAL.TYPE  <----------------------- junk
    // GLOBAL.FLAG  <------------------------- ok
    if (!flag.startsWith('FLAG')) {
      return null;
    }

    return flag;
  }

  function processArrayLikePropertyName(node: Node): string | null {
    // pc.vaginas[i].hasFlag
    if (!isMemberExpression(node)) {
      return null;
    }

    // pc.vaginas[i].X
    const member2 = node.object;
    if (!isMemberExpression(member2)) {
      return null;
    }

    // pc.vaginas[X].X
    const member3 = member2.object;
    if (!isMemberExpression(member3)) {
      return null;
    }

    // X.vaginas[X].X
    const identifier = member3.property;
    if (!isIdentifier(identifier)) {
      return null;
    }

    return identifier.name;
  }

  data.content.forEach(function (content) {
    simple(content.ast, {
      // <?>flags = [GLOBAL.FLAG]
      AssignmentExpression(node) {
        const member = node.left;
        if (!isMemberExpression(member)) {
          return;
        }

        const property = member.property;
        if (!isIdentifier(property)) {
          return;
        }

        const right = node.right;
        if (!isArrayExpression(right)) {
          return;
        }

        const elements = right.elements;
        if (elements.length === 0) {
          return;
        }

        bodyParts.forEach(function (part) {
          if (!part.assignmentVariants.includes(property.name)) {
            return;
          }

          elements.forEach(function (element) {
            if (element === null) {
              return;
            }

            const flag = processFlag(element);
            if (flag === null) {
              return;
            }

            part.flags.add(flag);
          });
        });
      },

      // has<?>Flag(GLOBAL.FLAG)
      // add<?>Flag(GLOBAL.FLAG)
      CallExpression(node) {
        const args = node.arguments;

        if (args.length === 0) {
          return;
        }

        // pc.has<?>Flag
        const member = node.callee;
        if (!isMemberExpression(member)) {
          return;
        }

        // X.has<?>Flag
        const _function = member.property;
        if (!isIdentifier(_function)) {
          return;
        }

        bodyParts.forEach(function (part, key) {
          if (!part.callVariants.includes(_function.name)) {
            return;
          }

          args.forEach(function (arg) {
            const flag = processFlag(arg);
            if (flag === null) {
              return;
            }

            key;

            part.flags.add(flag);
          });
        });
      },
    });

    simple(content.ast, {
      // <?>[i].flags = [GLOBAL.FLAG]
      AssignmentExpression(node) {
        const member = node.left;
        if (!isMemberExpression(member)) {
          return;
        }

        const propertyName = processArrayLikePropertyName(member);
        if (propertyName === null) {
          return;
        }

        const array = node.right;
        if (!isArrayExpression(array)) {
          return;
        }

        const elements = array.elements;
        if (elements.length === 0) {
          return;
        }

        arrayLikeBodyParts.forEach(function (part, key) {
          if (propertyName !== part.name) {
            return;
          }

          elements.forEach(function (element) {
            if (element === null) {
              return;
            }

            const flag = processFlag(element);
            if (flag === null) {
              return;
            }

            bodyParts.get(key)!.flags.add(flag);
          });
        });
      },

      // <?>[i].hasFlag(GLOBAL.FLAG)
      // <?>[i].addFlag(GLOBAL.FLAG)
      CallExpression(node) {
        const args = node.arguments;

        if (args.length === 0) {
          return;
        }

        const member = node.callee;
        if (!isMemberExpression(member)) {
          return;
        }

        const propertyName = processArrayLikePropertyName(member);
        if (propertyName === null) {
          return;
        }

        // X.X[X].hasFlag
        const _function = member.property;
        if (!isIdentifier(_function)) {
          return;
        }

        arrayLikeBodyParts.forEach(function (part, key) {
          if (propertyName !== part.name) {
            return;
          }

          if (!part.callVariants.includes(_function.name)) {
            return;
          }

          args.forEach(function (arg) {
            const flag = processFlag(arg);
            if (flag === null) {
              return;
            }

            bodyParts.get(key)!.flags.add(flag);
          });
        });
      },
    });

    simple(content.ast, {
      // ass.flags = [GLOBAL.FLAG]
      AssignmentExpression(node) {
        // pc.ass.flags
        const member = node.left;
        if (!isMemberExpression(member)) {
          return;
        }

        // pc.ass.X
        const member2 = member.object;
        if (!isMemberExpression(member2)) {
          return;
        }

        // X.ass.X
        const property = member2.property;
        if (!isIdentifier(property)) {
          return;
        }

        if (property.name !== 'ass') {
          return;
        }

        const array = node.right;
        if (!isArrayExpression(array)) {
          return;
        }

        const elements = array.elements;
        if (elements.length === 0) {
          return;
        }

        elements.forEach(function (element) {
          if (element === null) {
            return;
          }

          const flag = processFlag(element);
          if (flag === null) {
            return;
          }

          bodyParts.get('ass')!.flags.add(flag);
        });
      },

      // ass.hasFlag(GLOBAL.FLAG)
      // ass.addFlag(GLOBAL.FLAG)
      CallExpression(node) {
        const args = node.arguments;

        if (args.length === 0) {
          return;
        }

        // pc.ass.hasFlag
        const member = node.callee;
        if (!isMemberExpression(member)) {
          return;
        }

        // pc.ass.X
        const member2 = member.object;
        if (!isMemberExpression(member2)) {
          return;
        }

        // X.ass.X
        const property = member2.property;
        if (!isIdentifier(property)) {
          return;
        }


        if (property.name !== 'ass') {
          return;
        }

        // X.X.hasFlag
        const _function = member.property;
        if (!isIdentifier(_function)) {
          return;
        }

        const ass = bodyParts.get('ass')!;

        if (!assCallVariants.includes(_function.name)) {
          return;
        }

        args.forEach(function (arg) {
          const flag = processFlag(arg);
          if (flag === null) {
            return;
          }

          ass.flags.add(flag);
        });
      },
    });
  });

  bodyParts.forEach(function (item, key) {
    log(`Generated ${item.flags.size} valid ${key} flags`);

    result.valid.bodyPartFlags[key] = Array.from(item.flags)
      .map(function (key) {
        return data.globals[key] as number;
      })
      .sort(number.asc);
  });
};
