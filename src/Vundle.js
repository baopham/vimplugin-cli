// @flow

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import VimPluginSetting from './VimPluginSetting'
import log from './helpers/log'
import {
  getVimrcContent,
  getVimrcLines,
  formVimrcContent,
  buildPluginAndLineIndexMapper
} from './helpers/vimplugin'
import { escapeRegExp } from './helpers/regex'
import { confirm } from './helpers/prompt'
import { findAndRemoveFolders } from './helpers/remove-folders'

import type {
  RegexAndGroups
} from './helpers/regex'

export default class Vundle implements VimPlugin {
  vimrc: Path
  vimdir: Path
  settings: Path
  sourceCodeDir: Path

  constructor (vimrc: Path, vimdir: Path, settings: Path) {
    this.vimrc = vimrc
    this.vimdir = vimdir
    this.settings = settings
    this.sourceCodeDir = path.join(this.vimdir, 'bundle')

    Object.freeze(this)
  }

  async remove (pluginToSearch: string): Promise<*> {
    await this.findAndRemovePlugins(pluginToSearch)

    const vimPluginSetting = new VimPluginSetting(this.settings)

    await vimPluginSetting.findAndRemove(pluginToSearch)

    log(chalk.green(`Going to check ${this.sourceCodeDir}...`))
    await findAndRemoveFolders(pluginToSearch, this.sourceCodeDir)
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
    const question = plugin => `Found ${plugin}. You sure you want to remove it?`
    const pluginsToRemove = await confirm(plugins, question)

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
