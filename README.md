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


  Commands:

    rm <plugin>    Remove a plugin
    find <plugin>  Search for an installed plugin
    list           List all installed plugins
    help [cmd]     display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

`vimplugin rm` will remove the line in your .vimrc where it installs the plugin, delete the configuration file for this plugin in the specified settings directory. Before anything is deleted, the command will prompt you for confirmation.  

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
