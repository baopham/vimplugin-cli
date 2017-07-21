// @flow

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import rm from 'rimraf'
import log from './log'
import { escapeRegExp } from './regex'
import { confirm } from './prompt'

export async function findAndRemoveFolders (pluginToSearch: string, dir: Path): Promise<*> {
  const regex = new RegExp(escapeRegExp(pluginToSearch))
  const paths = fs.readdirSync(dir)
    .filter(name => regex.test(name))
    .map(name => `${path.join(dir, name)}`)
  const question = path => `Found ${path}. You sure you want to remove it?`
  const foldersToRemove = await confirm(paths, question)

  if (paths.length === 0) {
    log(chalk.yellow(`Found no plugged folder for ${pluginToSearch}`))
    return
  }

  foldersToRemove.forEach(folder => {
    log(chalk.green(`Removing ${folder}...`))
    rm.sync(folder)
    log(chalk.green(`${folder} is removed`))
  })
}
