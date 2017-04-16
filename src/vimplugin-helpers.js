// @flow

import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { EOL } from 'os'

const log = console.log

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

export async function findAndRemovePluginSettings (pluginToSearch: string, settings: Path): Promise<*> {
  if (!fs.existsSync(settings)) {
    return Promise.resolve()
  }

  const filenames = fs.readdirSync(settings)

  const regex = new RegExp(pluginToSearch, 'i')

  const settingFiles = filenames
  .filter(name => regex.test(name))
  .map(name => path.join(settings, name))

  const questions = settingFiles.map((path, index) => ({
    type: 'confirm',
    name: index + 1,
    message: `Found setting file: ${path}. You sure you want to remove it?`
  }))

  const answers = await inquirer.prompt(questions)

  const settingsToRemove = Object.keys(answers)
    .filter(index => answers[index])
    .map(index => settingFiles[index - 1])

  settingsToRemove.forEach(path => {
    log(chalk.green(`Removing setting file ${path}...`))
    fs.unlink(path)
    log(chalk.green(`${path} is removed`))
  })
}

// @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
export function escapeRegExp (str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
