'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCommonProgramOptions = setCommonProgramOptions;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var homedir = _os2.default.homedir();

function setCommonProgramOptions(program) {
  return program.option('--vimdir [vimdir]', 'Vim directory. Default to ~/.vim', homedir + '/.vim').option('--settings [settings]', 'Vim settings directory (where you configure your plugins). Default to ~/.vim/settings', homedir + '/.vim/settings').option('--vimrc [vimrc]', '.vimrc path. Default to ~/.vimrc', homedir + '/.vimrc');
}