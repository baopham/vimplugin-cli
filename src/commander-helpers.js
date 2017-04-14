import os from 'os'

const homedir = os.homedir()

export function setCommonProgramOptions (program) {
  return program
    .option('--vimdir [vimdir]', 'Vim directory. Default to ~/.vim', `${homedir}/.vim`)
    .option('--settings [settings]', 'Vim settings directory (where you configure your plugins). Default to ~/.vim/settings', `${homedir}/.vim/settings`)
    .option('--vimrc [vimrc]', '.vimrc path. Default to ~/.vimrc', `${homedir}/.vimrc`)
}
