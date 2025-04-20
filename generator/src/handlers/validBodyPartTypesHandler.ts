import { Handler } from '#src/types/handler.js';
import { ValidBodyPartTypesKey } from '#shared/types/generator/generator';

import { Node } from 'acorn';
import { simple } from 'acorn-walk';

import {
  isIdentifier,
  isMemberExpression,
} from '#src/utils/ast.js';
import { wrap } from '#src/utils/array.js';
import { log } from '#src/utils/log.js';
import { number } from '#src/utils/sort.js';

type BodyPartItem = {
  name: string;
  types: Set<string>;
};

type ArrayLikeBodyPartItem = {
  arrayName: string;
  typeName: string;
};

type ShiftableBodyPartItem = {
  callVariants: string[];
};

export const validBodyPartTypesHandler: Handler = function (data, result) {
  function generateShiftableCallVariants(part: string): string[] {
    return [
      `shift${part}`,
      `shiftAny${part}`,
    ];
  }

  function generateBodyPartItem(name: string): BodyPartItem {
    return {
      name,
      types: new Set<string>(),
    };
  }

  function generateArrayLikeBodyPartItem(arrayName: string, typeName: string): ArrayLikeBodyPartItem {
    return {
      arrayName,
      typeName,
    };
  }

  function generateShiftableBodyPartItem(callVariants: string | string[]): ShiftableBodyPartItem {
    return {
      callVariants: wrap(callVariants).map(generateShiftableCallVariants).flat(),
    };
  }

  const bodyParts = new Map<ValidBodyPartTypesKey, BodyPartItem>([
    ['antennae', generateBodyPartItem('antennae')],
    ['arm', generateBodyPartItem('arm')],
    ['cock', generateBodyPartItem('cock')],
    ['ear', generateBodyPartItem('ear')],
    ['eye', generateBodyPartItem('eye')],
    ['face', generateBodyPartItem('face')],
    ['horn', generateBodyPartItem('horn')],
    ['leg', generateBodyPartItem('leg')],
    ['tail', generateBodyPartItem('tail')],
    ['tongue', generateBodyPartItem('tongue')],
    ['vagina', generateBodyPartItem('vagina')],
    ['wing', generateBodyPartItem('wing')],
  ]);

  const arrayLikeBodyParts = new Map<ValidBodyPartTypesKey, ArrayLikeBodyPartItem>([
    ['cock', generateArrayLikeBodyPartItem('cocks', 'cType')],
    ['vagina', generateArrayLikeBodyPartItem('vaginas', 'type')],
  ]);

  const shiftableBodyParts = new Map<ValidBodyPartTypesKey, ShiftableBodyPartItem>([
    ['cock', generateShiftableBodyPartItem('Cock')],
    ['tail', generateShiftableBodyPartItem('Tail')],
    ['vagina', generateShiftableBodyPartItem('Vagina')],
    ['wing', generateShiftableBodyPartItem('Wings')],
  ]);

  function processType(node: Node): string | null {
    // literal  <--------------------------- junk
    // GLOBAL.TYPE  <------------------------- ok
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

    const type = right.name;

    // GLOBAL.FLAG  <----------------------- junk
    // GLOBAL.TYPE  <------------------------- ok
    if (!type.startsWith('TYPE')) {
      return null;
    }

    return type;
  }

  function processArrayLikePropertyName(node: Node): string | null {
    // pc.vaginas[i].type
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
      // <?>type = GLOBAL.TYPE
      AssignmentExpression(node) {
        const member = node.left;
        if (!isMemberExpression(member)) {
          return;
        }

        const property = member.property;
        if (!isIdentifier(property)) {
          return;
        }

        const type = processType(node.right);
        if (type === null) {
          return;
        }

        bodyParts.forEach(function (part) {
          if (property.name !== `${part.name}Type`) {
            return;
          }

          part.types.add(type);
        });
      },

      // <?>type === GLOBAL.TYPE
      // <?>type !== GLOBAL.TYPE
      BinaryExpression(node) {
        let type: string | null = null;
        let member: Node | null = null;

        if ((type = processType(node.left)) !== null) {
          member = node.right;
        }
        else if ((type = processType(node.right)) !== null) {
          member = node.left;
        }
        else {
          return;
        }

        if (!isMemberExpression(member)) {
          return;
        }

        const property = member.property;
        if (!isIdentifier(property)) {
          return;
        }

        bodyParts.forEach(function (part) {
          if (property.name != `${part.name}Type`) {
            return;
          }

          part.types.add(type);
        });
      },
    });

    simple(content.ast, {
      // <?>[i].type = GLOBAL.TYPE
      AssignmentExpression(node) {
        const member = node.left;
        if (!isMemberExpression(member)) {
          return;
        }

        const arrayName = processArrayLikePropertyName(member);
        if (arrayName === null) {
          return;
        }

        const typeNameIdentifier = member.property;
        if (!isIdentifier(typeNameIdentifier)) {
          return;
        }

        const type = processType(node.right);
        if (type === null) {
          return;
        }

        arrayLikeBodyParts.forEach(function (part, key) {
          if (arrayName !== part.arrayName) {
            return;
          }

          if (typeNameIdentifier.name !== part.typeName) {
            return;
          }

          bodyParts.get(key)!.types.add(type);
        });
      },

      // <?>[i].type === GLOBAL.TYPE
      // <?>[i].type !== GLOBAL.TYPE
      BinaryExpression(node) {
        let type: string | null = null;
        let member: Node | null = null;

        if ((type = processType(node.left)) !== null) {
          member = node.right;
        }
        else if ((type = processType(node.right)) !== null) {
          member = node.left;
        }
        else {
          return;
        }

        if (!isMemberExpression(member)) {
          return;
        }

        const arrayName = processArrayLikePropertyName(member);
        if (arrayName === null) {
          return;
        }

        const typeNameIdentifier = member.property;
        if (!isIdentifier(typeNameIdentifier)) {
          return;
        }

        arrayLikeBodyParts.forEach(function (part, key) {
          if (arrayName !== part.arrayName) {
            return;
          }

          if (typeNameIdentifier.name !== part.typeName) {
            return;
          }

          bodyParts.get(key)!.types.add(type);
        });
      },

      // shift<?>(GLOBAL.TYPE)
      CallExpression(node) {
        const args = node.arguments;

        if (args.length === 0) {
          return;
        }

        const member = node.callee;
        if (!isMemberExpression(member)) {
          return;
        }

        const _function = member.property;
        if (!isIdentifier(_function)) {
          return;
        }

        shiftableBodyParts.forEach(function (part, key) {
          if (!part.callVariants.includes(_function.name)) {
            return;
          }

          args.forEach(function (arg) {
            const type = processType(arg);
            if (type === null) {
              return;
            }

            bodyParts.get(key)!.types.add(type);
          });
        });
      },
    });
  });

  bodyParts.forEach(function (item, key) {
    log(`Generated ${item.types.size} valid ${key} types`);

    result.valid.bodyPartTypes[key] = Array.from(item.types)
      .map(function (key) {
        return data.globals[key] as number;
      })
      .sort(number.asc);
  });
};
