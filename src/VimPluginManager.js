// @flow

import fs from 'fs'
import VimPlug from './VimPlug'

export default class VimPluginManager {
  vimrc: Path

  constructor (vimrc: Path) {
    this.vimrc = vimrc

    Object.freeze(this)
  }

  get (vimrc: Path, vimdir: Path, settings: Path) {
    const vimrcContent = fs.readFileSync(this.vimrc, 'utf8')

    if (vimrcContent.includes('call plug#begin')) {
      return new VimPlug(vimrc, vimdir, settings)
    }
  }
}
