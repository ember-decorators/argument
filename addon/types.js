import unionOf from './-private/types/union-of';

export { default as arrayOf } from './-private/types/array-of';
export { default as optional } from './-private/types/optional';
export { default as oneOf } from './-private/types/one-of';
export { default as shapeOf } from './-private/types/shape-of';
export { unionOf };

/**
 * Action type, for "closure actions"
 */
export const Action = Function;

/**
 * "Classic" Action type, covers both string actions and closure actions
 */
export const ClassicAction = unionOf('string', Function);

/**
 * Element type polyfill for fastboot
 */
export const Element = window ? window.Element : class Element {};

/**
 * Node type polyfill for fastboot
 */
export const Node = window ? window.Node : class Node {};
