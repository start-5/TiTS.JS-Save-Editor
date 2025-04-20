import {
  ArrayExpression,
  AssignmentExpression,
  ConditionalExpression,
  ExpressionStatement,
  Identifier,
  Literal,
  MemberExpression,
  Node,
  ObjectExpression,
  Property,
  SequenceExpression,
  SwitchStatement
} from 'acorn';

type NodeType =
  'Identifier'
  | 'Literal'
  | 'Program'
  | 'ExpressionStatement'
  | 'BlockStatement'
  | 'EmptyStatement'
  | 'DebuggerStatement'
  | 'WithStatement'
  | 'ReturnStatement'
  | 'LabeledStatement'
  | 'BreakStatement'
  | 'ContinueStatement'
  | 'IfStatement'
  | 'SwitchStatement'
  | 'SwitchCase'
  | 'ThrowStatement'
  | 'TryStatement'
  | 'CatchClause'
  | 'WhileStatement'
  | 'DoWhileStatement'
  | 'ForStatement'
  | 'ForInStatement'
  | 'FunctionDeclaration'
  | 'VariableDeclaration'
  | 'VariableDeclarator'
  | 'ThisExpression'
  | 'ArrayExpression'
  | 'ObjectExpression'
  | 'Property'
  | 'FunctionExpression'
  | 'UnaryExpression'
  | 'UpdateExpression'
  | 'BinaryExpression'
  | 'AssignmentExpression'
  | 'LogicalExpression'
  | 'MemberExpression'
  | 'ConditionalExpression'
  | 'CallExpression'
  | 'NewExpression'
  | 'SequenceExpression'
  | 'ForOfStatement'
  | 'Super'
  | 'SpreadElement'
  | 'ArrowFunctionExpression'
  | 'YieldExpression'
  | 'TemplateLiteral'
  | 'TaggedTemplateExpression'
  | 'TemplateElement'
  | 'Property'
  | 'ObjectPattern'
  | 'ArrayPattern'
  | 'RestElement'
  | 'AssignmentPattern'
  | 'ClassBody'
  | 'MethodDefinition'
  | 'ClassDeclaration'
  | 'ClassExpression'
  | 'MetaProperty'
  | 'ImportDeclaration'
  | 'ImportSpecifier'
  | 'ImportDefaultSpecifier'
  | 'ImportNamespaceSpecifier'
  | 'ImportAttribute'
  | 'ExportNamedDeclaration'
  | 'ExportSpecifier'
  | 'FunctionDeclaration'
  | 'ClassDeclaration'
  | 'ExportDefaultDeclaration'
  | 'ExportAllDeclaration'
  | 'AwaitExpression'
  | 'ChainExpression'
  | 'ImportExpression'
  | 'ParenthesizedExpression'
  | 'PropertyDefinition'
  | 'PrivateIdentifier'
  | 'StaticBlock';

export function isNode<T extends Node>(value: Partial<Node>, type: NodeType): value is T {
  return value?.type === type;
}

function is<T extends Node>(type: NodeType): (value: Node) => value is T {
  return function (value: Node): value is T {
    return isNode(value, type);
  };
}

export const isArrayExpression = is<ArrayExpression>('ArrayExpression');
export const isAssignmentExpression = is<AssignmentExpression>('AssignmentExpression');
export const isConditionalExpression = is<ConditionalExpression>('ConditionalExpression');
export const isExpressionStatement = is<ExpressionStatement>('ExpressionStatement');
export const isIdentifier = is<Identifier>('Identifier');
export const isLiteral = is<Literal>('Literal');
export const isMemberExpression = is<MemberExpression>('MemberExpression');
export const isObjectExpression = is<ObjectExpression>('ObjectExpression');
export const isProperty = is<Property>('Property');
export const isSequenceExpression = is<SequenceExpression>('SequenceExpression');
export const isSwitchStatement = is<SwitchStatement>('SwitchStatement');
