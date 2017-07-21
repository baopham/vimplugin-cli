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

export default class VimPlug implements VimPlugin {
  vimrc: Path
  vimdir: Path
  settings: Path
  sourceCodeDir: Path

  constructor (vimrc: Path, vimdir: Path, settings: Path) {
    this.vimrc = vimrc
    this.vimdir = vimdir
    this.settings = settings
    this.sourceCodeDir = path.join(this.vimdir, 'plugged')

    Object.freeze(this)
  }

  async remove (pluginToSearch: string): Promise<*> {
    await this.findAndRemovePlugs(pluginToSearch)

    const vimPluginSetting = new VimPluginSetting(this.settings)
    await vimPluginSetting.findAndRemove(pluginToSearch)

    log(chalk.green(`Going to check ${this.sourceCodeDir}...`))
    await findAndRemoveFolders(pluginToSearch, this.sourceCodeDir)
  }

  find (pluginToSearch: string): void {
    const vimrcContent = getVimrcContent(this.vimrc)

    const mapper = buildPluginAndLineIndexMapper(this.getPluginRegex(pluginToSearch), vimrcContent)

    const plugins = Object.keys(mapper)

    if (plugins.length === 0) {
      log(chalk.yellow(`Could not find ${pluginToSearch}`))
      return
    }

    plugins.forEach(plugin => log(chalk.green(`Found: ${plugin}`)))
  }

  list (): void {
    const vimrcContent = getVimrcContent(this.vimrc)

    const regex = new RegExp(`Plug '(.+)'`)
    const regexGroups = {
      Plugin: 1
    }

    getVimrcLines(vimrcContent).forEach(line => {
      if (!line.startsWith('Plug ')) {
        return
      }

      const plugs = line.includes('|')
        ? line.split('|').map(plug => plug.trim())
        : [line.trim()]

      const plugins = plugs
        .filter(plug => regex.test(plug))
        .map(plug => regex.exec(plug)[regexGroups.Plugin])
        .map(plug => plug.replace(new RegExp(`,\\s*{.+$`), '').replace(`'`, ''))

      plugins.forEach(plugin => log(chalk.green(plugin)))
    })
  }

  async findAndRemovePlugs (pluginToSearch: string): Promise<*> {
    const vimrcContent = getVimrcContent(this.vimrc)
    const mapper = buildPluginAndLineIndexMapper(this.getPluginRegex(pluginToSearch), vimrcContent)
    const plugins = Object.keys(mapper)

    if (plugins.length === 0) {
      log(chalk.yellow(`Found no plugins that match ${pluginToSearch}`))
      return
    }

    const question = plugin => `Found ${plugin}. You sure you want to remove it?`
    const pluginsToRemove = await confirm(plugins, question)

    pluginsToRemove.forEach(plugin => {
      log(chalk.green(`Removing ${plugin}...`))
      this.removePlug(plugin)
      log(chalk.green(`${plugin} is removed`))
    })
  }

  removePlug (plugin: string): void {
    const vimrcContent = getVimrcContent(this.vimrc)
    const lines = getVimrcLines(vimrcContent)
    const plug = `Plug '${plugin}'`
    const lineIndex = lines.findIndex(line => line.includes(plug))

    if (lineIndex < 0) {
      log(chalk.red(`Could not find ${plugin} to remove`))
      return
    }

    let line = lines[lineIndex]

    if (line.includes(`${plug}, {`) || line.includes(`${plug},{`)) {
      line = line.replace(new RegExp(`(${escapeRegExp(plug)})(\\s*,\\s*{.+})`), '$1')
    }

    const newLine = line.includes('|')
      ? line.split('|').filter(plugItem => !plugItem.includes(plug)).join('|')
      : line.replace(plug, '')

    lines[lineIndex] = newLine

    if (!newLine) {
      lines.splice(lineIndex, 1)
    }

    fs.writeFileSync(this.vimrc, formVimrcContent(lines))
  }

  getPluginRegex (pluginToSearch: string): RegexAndGroups {
    const regex = new RegExp(`Plug '(\\S*${escapeRegExp(pluginToSearch)}\\S*)'`, 'i')
    const regexGroups = {
      Plugin: 1
    }

    return [regex, regexGroups]
  }
}
