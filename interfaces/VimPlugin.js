interface VimPlugin {
  vimrc: Path,

  vimdir: Path,

  settings: Path,

  remove (pluginToSearch: string): Promise<*>,

  find (pluginToSearch: string): void,

  list(): void,
}
