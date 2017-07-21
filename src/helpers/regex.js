// @flow

export type RegexAndGroups = [RegExp, { [regexGroup: string]: number }]
// @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
export function escapeRegExp (str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
