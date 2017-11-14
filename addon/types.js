import { unionOf } from '@ember-decorators/argument/-debug';

/**
 * Action type, covers both string actions and closure actions
 */
export const Action = unionOf('string', Function);

/**
 * Action type, covers both string actions and closure actions
 */
export const ClosureAction = Function;

/**
 * Element type polyfill for fastboot
 */
export const Element = window ? window.Element : class Element {};

/**
 * Node type polyfill for fastboot
 */
export const Node = window ? window.Node : class Node {};
