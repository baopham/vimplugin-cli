'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _vimpluginHelpers = require('./vimplugin-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = console.log;

var VimPlug = function () {
  function VimPlug(vimrc, vimdir, settings) {
    _classCallCheck(this, VimPlug);

    this.vimrc = vimrc;
    this.vimdir = vimdir;
    this.settings = settings;

    Object.freeze(this);
  }

  _createClass(VimPlug, [{
    key: 'remove',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(pluginToSearch) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.findAndRemovePlugs(pluginToSearch);

              case 2:
                _context.next = 4;
                return (0, _vimpluginHelpers.findAndRemovePluginSettings)(pluginToSearch, this.settings);

              case 4:
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
      var vimrcContent = (0, _vimpluginHelpers.getVimrcContent)(this.vimrc);

      var mapper = (0, _vimpluginHelpers.buildPluginAndLineIndexMapper)(this.getPluginRegex(pluginToSearch), vimrcContent);

      var plugins = Object.keys(mapper);

      if (plugins.length === 0) {
        log(_chalk2.default.yellow('Could not find ' + pluginToSearch));
        return;
      }

      plugins.forEach(function (plugin) {
        return log(_chalk2.default.green('Found: ' + plugin));
      });
    }
  }, {
    key: 'list',
    value: function list() {
      var vimrcContent = (0, _vimpluginHelpers.getVimrcContent)(this.vimrc);

      var regex = new RegExp('Plug \'(.+)\'');
      var regexGroups = {
        Plugin: 1
      };

      (0, _vimpluginHelpers.getVimrcLines)(vimrcContent).forEach(function (line) {
        if (!line.startsWith('Plug ')) {
          return;
        }

        var plugs = line.includes('|') ? line.split('|').map(function (plug) {
          return plug.trim();
        }) : [line.trim()];

        var plugins = plugs.filter(function (plug) {
          return regex.test(plug);
        }).map(function (plug) {
          return regex.exec(plug)[regexGroups.Plugin];
        }).map(function (plug) {
          return plug.replace(new RegExp(',\\s*{.+$'), '').replace('\'', '');
        });

        plugins.forEach(function (plugin) {
          return log(_chalk2.default.green(plugin));
        });
      });
    }
  }, {
    key: 'findAndRemovePlugs',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(pluginToSearch) {
        var _this = this;

        var vimrcContent, mapper, plugins, questions, answers, pluginsToRemove;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                vimrcContent = (0, _vimpluginHelpers.getVimrcContent)(this.vimrc);
                mapper = (0, _vimpluginHelpers.buildPluginAndLineIndexMapper)(this.getPluginRegex(pluginToSearch), vimrcContent);
                plugins = Object.keys(mapper);

                if (!(plugins.length === 0)) {
                  _context2.next = 6;
                  break;
                }

                log(_chalk2.default.yellow('Found no plugins that match ' + pluginToSearch));
                return _context2.abrupt('return', Promise.resolve());

              case 6:
                questions = plugins.map(function (plugin, index) {
                  return {
                    type: 'confirm',
                    // Need to use index here, plugin could contain periods
                    name: index + 1,
                    message: 'Found ' + plugin + '. You sure you want to remove it?'
                  };
                });
                _context2.next = 9;
                return _inquirer2.default.prompt(questions);

              case 9:
                answers = _context2.sent;
                pluginsToRemove = Object.keys(answers).filter(function (index) {
                  return answers[index];
                }).map(function (index) {
                  return plugins[index - 1];
                });


                pluginsToRemove.forEach(function (plugin) {
                  log(_chalk2.default.green('Removing ' + plugin + '...'));
                  _this.removePlug(plugin);
                  log(_chalk2.default.green(plugin + ' is removed'));
                });

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function findAndRemovePlugs(_x2) {
        return _ref2.apply(this, arguments);
      }

      return findAndRemovePlugs;
    }()
  }, {
    key: 'removePlug',
    value: function removePlug(plugin) {
      var vimrcContent = (0, _vimpluginHelpers.getVimrcContent)(this.vimrc);

      var lines = (0, _vimpluginHelpers.getVimrcLines)(vimrcContent);

      var plug = 'Plug \'' + plugin + '\'';

      var lineIndex = lines.findIndex(function (line) {
        return line.includes(plug);
      });

      if (lineIndex < 0) {
        log(_chalk2.default.red('Could not find ' + plugin + ' to remove'));
        return;
      }

      var line = lines[lineIndex];

      if (line.includes(plug + ', {') || line.includes(plug + ',{')) {
        line = line.replace(new RegExp('(' + (0, _vimpluginHelpers.escapeRegExp)(plug) + ')(\\s*,\\s*{.+})'), '$1');
      }

      var newLine = line.includes('|') ? line.split('|').filter(function (plugItem) {
        return !plugItem.includes(plug);
      }).join('|') : line.replace(plug, '');

      lines[lineIndex] = newLine;

      if (!newLine) {
        lines.splice(lineIndex, 1);
      }

      _fs2.default.writeFileSync(this.vimrc, (0, _vimpluginHelpers.formVimrcContent)(lines));
    }
  }, {
    key: 'getPluginRegex',
    value: function getPluginRegex(pluginToSearch) {
      var regex = new RegExp('Plug \'(\\S*' + (0, _vimpluginHelpers.escapeRegExp)(pluginToSearch) + '\\S*)\'', 'i');
      var regexGroups = {
        Plugin: 1
      };

      return [regex, regexGroups];
    }
  }]);

  return VimPlug;
}();

exports.default = VimPlug;