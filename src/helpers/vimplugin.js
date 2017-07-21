// @flow

import fs from 'fs'
import { EOL } from 'os'
import type { RegexAndGroups } from './regex'

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
