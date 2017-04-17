// @flow

import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import chalk from 'chalk'
import open from 'opn'
import { escapeRegExp } from './vimplugin-helpers'

const log = console.log

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

  async findAndOpen (pluginToSearch: string): Promise<*> {
    const settingFiles = this.findAll(pluginToSearch)

    if (!settingFiles.length) {
      log(chalk.yellow(`Could not find any plugin setting for ${pluginToSearch}`))
      return
    }

    const questions = settingFiles.map((path, index) => ({
      type: 'confirm',
      name: index + 1,
      message: `Found setting file: ${path}. Open it?`
    }))

    const answers = await inquirer.prompt(questions)

    const settingsToOpen = Object.keys(answers)
      .filter(index => answers[index])
      .map(index => settingFiles[index - 1])

    settingsToOpen.forEach(open)
  }
}
