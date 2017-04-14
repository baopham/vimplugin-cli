// @flow

import fs from 'fs'
import { EOL } from 'os'
import inquirer from 'inquirer'
import chalk from 'chalk'
import path from 'path'

const log = console.log

type PluginLineIndexMapper = {
  [plugin: string]: number
}

export default class VimPlug {
  vimrc: Path
  vimdir: Path
  settings: Path

  constructor (vimrc: Path, vimdir: Path, settings: Path) {
    this.vimrc = vimrc
    this.vimdir = vimdir
    this.settings = settings

    Object.freeze(this)
  }

  async remove (pluginToSearch: string) {
    const vimrcContent = this.getVimrcContent()

    await this.findAndRemovePlugs(pluginToSearch, vimrcContent)
    await this.findAndRemovePluginSetting(pluginToSearch)
  }

  async find (pluginToSearch: string) {
    const vimrcContent = this.getVimrcContent()

    const mapper = this.buildPluginAndLineIndexMapper(pluginToSearch, vimrcContent)

    Object.keys(mapper).forEach(plugin => log(chalk.green(`Found: ${plugin}`)))
  }

  async findAndRemovePluginSetting (pluginToSearch: string): Promise<*> {
    if (!fs.existsSync(this.settings)) {
      return Promise.resolve()
    }

    const filenames = fs.readdirSync(this.settings)

    const regex = new RegExp(pluginToSearch, 'i')

    const settingFiles = filenames
      .filter(name => regex.test(name))
      .map(name => path.join(this.settings, name))

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

  async findAndRemovePlugs (pluginToSearch: string, vimrcContent: string): Promise<*> {
    const mapper = this.buildPluginAndLineIndexMapper(pluginToSearch, vimrcContent)

    const plugins = Object.keys(mapper)

    if (plugins.length === 0) {
      log(chalk.yellow(`Found no plugins that match ${pluginToSearch}`))
      return Promise.resolve()
    }

    const questions = plugins.map((plugin, index) => ({
      type: 'confirm',
      // Need to use index here, plugin could contain periods
      name: index + 1,
      message: `Found ${plugin}. You sure you want to remove it?`
    }))

    const answers = await inquirer.prompt(questions)

    const pluginsToRemove = Object.keys(answers)
      .filter(index => answers[index])
      .map(index => plugins[index - 1])

    pluginsToRemove.forEach(plugin => {
      log(chalk.green(`Removing ${plugin}...`))
      this.removePlug(plugin, mapper, vimrcContent)
      log(chalk.green(`${plugin} is removed`))
    })
  }

  getVimrcContent () {
    return fs.readFileSync(this.vimrc, 'utf8')
  }

  buildPluginAndLineIndexMapper (pluginToSearch: string, vimrcContent: string): PluginLineIndexMapper {
    const regex = new RegExp(`Plug '(\\S*${pluginToSearch}\\S*)'`, 'i')

    const lines = vimrcContent.split(EOL)

    const mapper = lines
      .reduce((acc, line, lineIndex) => {
        const [, plugin] = regex.exec(line) || []

        if (plugin) {
          acc[plugin] = lineIndex
        }

        return acc
      }, {})

    return mapper
  }

  removePlug (plugin: string, mapper: PluginLineIndexMapper, vimrcContent: string): void {
    const lineIndex = mapper[plugin]

    const lines = vimrcContent.split(EOL)

    let line = lines[lineIndex]

    const plug = `Plug '${plugin}'`

    if (line.includes(`${plug}, {`) || line.includes(`${plug},{`)) {
      line = line.replace(new RegExp(`(${plug})(,\\s*{\\.+})`), '$1')
    }

    const newLine = line.includes('|')
      ? line.split('|').filter(plugItem => !plugItem.includes(plug)).join('|')
      : line.replace(plug, '')

    lines[lineIndex] = newLine

    fs.writeFileSync(this.vimrc, lines.join(EOL))
  }
}
