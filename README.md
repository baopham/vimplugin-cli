vimplugin-cli
=============

A CLI to manage your vim plugins

Support:
------
- [x] [vim-plug](https://github.com/junegunn/vim-plug)
- [x] [vundle](https://github.com/VundleVim/Vundle.vim)

Usage:
------

```bash
  Usage: vimplugin [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    rm [plugin]         Remove a plugin
    find [plugin]       Search for an installed plugin
    list                List all installed plugins
    customize [plugin]  Open/Edit a plugin setting
    help [cmd]          display help for [cmd]
```

`vimplugin rm` will remove the line in your .vimrc where it installs the plugin, delete the configuration file for this plugin in the specified settings directory and finally remove the plugin source code. Before anything is deleted, the command will prompt you for confirmation.  

I built this so that it's quicker to uninstall a plugin with my particular [vim setup](https://github.com/baopham/vim)

Requirements:
-------------
* Node ^6
* npm ^3

Install:
--------

```
npm install vimplugin-cli -g
```

License:
--------
MIT

Author:
-------
Bao Pham
