// @flow

import fs from 'fs'
import { EOL } from 'os'

export type RegexAndGroups = [RegExp, { [regexGroup: string]: number }]

export type PluginLineIndexMapper = {
  [plugin: string]: number
}

export function getVimrcContent (vimrc: Path): string {
  return fs.readFileSync(vimrc, 'utf8')
}

export function getVimrcLines (vimrcContent: string): string[] {
  return vimrcContent.split(EOL)
}

export function formVimrcContent (lines: string[]): string {
  return lines.join(EOL)
}

export function buildPluginAndLineIndexMapper (
  regexAndGroups: RegexAndGroups,
  vimrcContent: string
): PluginLineIndexMapper {
  const [regex, regexGroups] = regexAndGroups

  const lines = getVimrcLines(vimrcContent)

  const mapper = lines
    .reduce((acc, line, lineIndex) => {
      if (!regex.test(line)) {
        return acc
      }

      const plugin = regex.exec(line)[regexGroups.Plugin]

      acc[plugin] = lineIndex

      return acc
    }, {})

  return mapper
}

// @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
export function escapeRegExp (str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
