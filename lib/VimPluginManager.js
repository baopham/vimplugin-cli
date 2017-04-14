'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _VimPlug = require('./VimPlug');

var _VimPlug2 = _interopRequireDefault(_VimPlug);

var _Vundle = require('./Vundle');

var _Vundle2 = _interopRequireDefault(_Vundle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VimPluginManager = function () {
  function VimPluginManager(vimrc) {
    _classCallCheck(this, VimPluginManager);

    this.vimrc = vimrc;

    Object.freeze(this);
  }

  _createClass(VimPluginManager, [{
    key: 'get',
    value: function get(vimrc, vimdir, settings) {
      var vimrcContent = _fs2.default.readFileSync(this.vimrc, 'utf8');

      if (vimrcContent.includes('call plug#begin')) {
        return new _VimPlug2.default(vimrc, vimdir, settings);
      }

      if (vimrcContent.includes('call vundle#begin')) {
        return new _Vundle2.default(vimrc, vimdir, settings);
      }
    }
  }]);

  return VimPluginManager;
}();

exports.default = VimPluginManager;