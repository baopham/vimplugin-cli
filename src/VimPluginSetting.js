// @flow

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import open from 'opn'
import log from './helpers/log'
import { escapeRegExp } from './helpers/regex'
import { confirm } from './helpers/prompt'

export default class VimPluginSetting {
  settings: Path

  constructor (settings: Path) {
    this.settings = settings

    Object.freeze(this)
  }

  findAll (pluginToSearch: string): Path[] {
    if (!fs.existsSync(this.settings)) {
      return []
    }

    const filenames = fs.readdirSync(this.settings)

    const regex = new RegExp(escapeRegExp(pluginToSearch), 'i')

    const settingFiles = filenames
      .filter(name => regex.test(name))
      .map(name => path.join(this.settings, name))

    return settingFiles
  }

  async findAndRemove (pluginToSearch: string): Promise<*> {
    const settingFiles = this.findAll(pluginToSearch)

    if (!settingFiles.length) {
      log(chalk.yellow(`Could not find any plugin setting for ${pluginToSearch}`))
      return
    }

    const question = (path): string => `Found setting file: ${path}. You sure you want to remove it?`
    const settingsToRemove = await confirm(settingFiles, question)

    settingsToRemove.forEach(path => {
      log(chalk.green(`Removing setting file ${path}...`))
      fs.unlinkSync(path)
      log(chalk.green(`${path} is removed`))
    })
  }

  async findAndOpen (pluginToSearch: string): Promise<*> {
    const settingFiles = this.findAll(pluginToSearch)

    if (!settingFiles.length) {
      log(chalk.yellow(`Could not find any plugin setting for ${pluginToSearch}`))
      return
    }

    const question = (path): string => `Found setting file: ${path}. Open it?`
    const settingsToOpen = await confirm(settingFiles, question)

    settingsToOpen.forEach(open)
  }
}
