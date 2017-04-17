'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _VimPluginManager = require('./VimPluginManager');

var _VimPluginManager2 = _interopRequireDefault(_VimPluginManager);

var _VimPluginSetting = require('./VimPluginSetting');

var _VimPluginSetting2 = _interopRequireDefault(_VimPluginSetting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  VimPluginManager: _VimPluginManager2.default,
  VimPluginSetting: _VimPluginSetting2.default
};