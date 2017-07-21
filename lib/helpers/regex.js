'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeRegExp = escapeRegExp;

// @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}