// @flow

import fs from 'fs'
import chalk from 'chalk'
import inquirer from 'inquirer'
import {
  getVimrcContent,
  getVimrcLines,
  formVimrcContent,
  buildPluginAndLineIndexMapper,
  findAndRemovePluginSettings,
  escapeRegExp
} from './vimplugin-helpers'

import type {
  RegexAndGroups
} from './vimplugin-helpers'

const log = console.log

export default class Vundle implements VimPlugin {
  vimrc: Path
  vimdir: Path
  settings: Path

  constructor (vimrc: Path, vimdir: Path, settings: Path) {
    this.vimrc = vimrc
    this.vimdir = vimdir
    this.settings = settings

    Object.freeze(this)
  }

  async remove (pluginToSearch: string): Promise<*> {
    await this.findAndRemovePlugins(pluginToSearch)
    await findAndRemovePluginSettings(pluginToSearch, this.settings)
  }

  find (pluginToSearch: string): void {
    const mapper = buildPluginAndLineIndexMapper(this.getPluginRegex(pluginToSearch), getVimrcContent(this.vimrc))

    const plugins = Object.keys(mapper)

    if (plugins.length === 0) {
      log(chalk.yellow(`Could not find ${pluginToSearch}`))
      return
    }

    plugins.forEach(plugin => log(chalk.green(`Found: ${plugin}`)))
  }

  list (): void {
    const vimrcContent = getVimrcContent(this.vimrc)

    const regex = new RegExp(`^(Bundle|Plugin) '(.+)'`)
    const regexGroups = {
      Plugin: 2
    }

    getVimrcLines(vimrcContent).forEach(line => {
      if (!regex.test(line)) {
        return
      }

      const plugin = regex.exec(line)[regexGroups.Plugin]

      log(chalk.green(plugin))
    })
  }

  async findAndRemovePlugins (pluginToSearch: string): Promise<*> {
    const vimrcContent = getVimrcContent(this.vimrc)

    const mapper = buildPluginAndLineIndexMapper(this.getPluginRegex(pluginToSearch), vimrcContent)

    const plugins = Object.keys(mapper)

    const questions = plugins.map((plugin, index) => ({
      type: 'confirm',
      name: index + 1,
      message: `Found ${plugin}. You sure you want to remove it?`
    }))

    const answers = await inquirer.prompt(questions)

    const pluginsToRemove = Object.keys(answers)
      .filter(index => answers[index])
      .map(index => plugins[index - 1])

    pluginsToRemove.forEach(plugin => {
      log(chalk.green(`Removing ${plugin}...`))
      this.removePlugin(plugin)
      log(chalk.green(`${plugin} is removed`))
    })
  }

  removePlugin (plugin: string): void {
    const vimrcContent = getVimrcContent(this.vimrc)

    const lines = getVimrcLines(vimrcContent)

    const regex = new RegExp(`^(Bundle|Plugin) '${escapeRegExp(plugin)}'`)

    const newLines = lines.filter(line => !regex.test(line))

    fs.writeFileSync(this.vimrc, formVimrcContent(newLines))
  }

  getPluginRegex (pluginToSearch: string): RegexAndGroups {
    const regex = new RegExp(`^(Bundle|Plugin) '(\\S*${escapeRegExp(pluginToSearch)}\\S*)'`, 'i')
    const regexGroups = {
      Plugin: 2
    }

    return [regex, regexGroups]
  }
}
