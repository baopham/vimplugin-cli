'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _VimPluginSetting = require('./VimPluginSetting');

var _VimPluginSetting2 = _interopRequireDefault(_VimPluginSetting);

var _log = require('./helpers/log');

var _log2 = _interopRequireDefault(_log);

var _vimplugin = require('./helpers/vimplugin');

var _regex = require('./helpers/regex');

var _prompt = require('./helpers/prompt');

var _removeFolders = require('./helpers/remove-folders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vundle = function () {
  function Vundle(vimrc, vimdir, settings) {
    _classCallCheck(this, Vundle);

    this.vimrc = vimrc;
    this.vimdir = vimdir;
    this.settings = settings;
    this.sourceCodeDir = _path2.default.join(this.vimdir, 'bundle');

    Object.freeze(this);
  }

  _createClass(Vundle, [{
    key: 'remove',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(pluginToSearch) {
        var vimPluginSetting;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.findAndRemovePlugins(pluginToSearch);

              case 2:
                vimPluginSetting = new _VimPluginSetting2.default(this.settings);
                _context.next = 5;
                return vimPluginSetting.findAndRemove(pluginToSearch);

              case 5:

                (0, _log2.default)(_chalk2.default.green('Going to check ' + this.sourceCodeDir + '...'));
                _context.next = 8;
                return (0, _removeFolders.findAndRemoveFolders)(pluginToSearch, this.sourceCodeDir);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function remove(_x) {
        return _ref.apply(this, arguments);
      }

      return remove;
    }()
  }, {
    key: 'find',
    value: function find(pluginToSearch) {
      var mapper = (0, _vimplugin.buildPluginAndLineIndexMapper)(this.getPluginRegex(pluginToSearch), (0, _vimplugin.getVimrcContent)(this.vimrc));

      var plugins = Object.keys(mapper);

      if (plugins.length === 0) {
        (0, _log2.default)(_chalk2.default.yellow('Could not find ' + pluginToSearch));
        return;
      }

      plugins.forEach(function (plugin) {
        return (0, _log2.default)(_chalk2.default.green('Found: ' + plugin));
      });
    }
  }, {
    key: 'list',
    value: function list() {
      var vimrcContent = (0, _vimplugin.getVimrcContent)(this.vimrc);

      var regex = new RegExp('^(Bundle|Plugin) \'(.+)\'');
      var regexGroups = {
        Plugin: 2
      };

      (0, _vimplugin.getVimrcLines)(vimrcContent).forEach(function (line) {
        if (!regex.test(line)) {
          return;
        }

        var plugin = regex.exec(line)[regexGroups.Plugin];

        (0, _log2.default)(_chalk2.default.green(plugin));
      });
    }
  }, {
    key: 'findAndRemovePlugins',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(pluginToSearch) {
        var _this = this;

        var vimrcContent, mapper, plugins, question, pluginsToRemove;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                vimrcContent = (0, _vimplugin.getVimrcContent)(this.vimrc);
                mapper = (0, _vimplugin.buildPluginAndLineIndexMapper)(this.getPluginRegex(pluginToSearch), vimrcContent);
                plugins = Object.keys(mapper);

                question = function question(plugin) {
                  return 'Found ' + plugin + '. You sure you want to remove it?';
                };

                _context2.next = 6;
                return (0, _prompt.confirm)(plugins, question);

              case 6:
                pluginsToRemove = _context2.sent;


                pluginsToRemove.forEach(function (plugin) {
                  (0, _log2.default)(_chalk2.default.green('Removing ' + plugin + '...'));
                  _this.removePlugin(plugin);
                  (0, _log2.default)(_chalk2.default.green(plugin + ' is removed'));
                });

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function findAndRemovePlugins(_x2) {
        return _ref2.apply(this, arguments);
      }

      return findAndRemovePlugins;
    }()
  }, {
    key: 'removePlugin',
    value: function removePlugin(plugin) {
      var vimrcContent = (0, _vimplugin.getVimrcContent)(this.vimrc);

      var lines = (0, _vimplugin.getVimrcLines)(vimrcContent);

      var regex = new RegExp('^(Bundle|Plugin) \'' + (0, _regex.escapeRegExp)(plugin) + '\'');

      var newLines = lines.filter(function (line) {
        return !regex.test(line);
      });

      _fs2.default.writeFileSync(this.vimrc, (0, _vimplugin.formVimrcContent)(newLines));
    }
  }, {
    key: 'getPluginRegex',
    value: function getPluginRegex(pluginToSearch) {
      var regex = new RegExp('^(Bundle|Plugin) \'(\\S*' + (0, _regex.escapeRegExp)(pluginToSearch) + '\\S*)\'', 'i');
      var regexGroups = {
        Plugin: 2
      };

      return [regex, regexGroups];
    }
  }]);

  return Vundle;
}();

exports.default = Vundle;