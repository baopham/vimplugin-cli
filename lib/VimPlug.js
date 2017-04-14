'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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
        var vimrcContent;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                vimrcContent = this.getVimrcContent();
                _context.next = 3;
                return this.findAndRemovePlugs(pluginToSearch, vimrcContent);

              case 3:
                _context.next = 5;
                return this.findAndRemovePluginSetting(pluginToSearch);

              case 5:
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
    key: 'findAndRemovePluginSetting',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(pluginToSearch) {
        var _this = this;

        var filenames, regex, settingFiles, questions, answers, settingsToRemove;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (_fs2.default.existsSync(this.settings)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return', Promise.resolve());

              case 2:
                filenames = _fs2.default.readdirSync(this.settings);
                regex = new RegExp(pluginToSearch, 'i');
                settingFiles = filenames.filter(function (name) {
                  return regex.test(name);
                }).map(function (name) {
                  return _path2.default.join(_this.settings, name);
                });
                questions = settingFiles.map(function (path, index) {
                  return {
                    type: 'confirm',
                    name: index + 1,
                    message: 'Found setting file: ' + path + '. You sure you want to remove it?'
                  };
                });
                _context2.next = 8;
                return _inquirer2.default.prompt(questions);

              case 8:
                answers = _context2.sent;
                settingsToRemove = Object.keys(answers).filter(function (index) {
                  return answers[index];
                }).map(function (index) {
                  return settingFiles[index - 1];
                });


                settingsToRemove.forEach(function (path) {
                  log(_chalk2.default.green('Removing setting file ' + path + '...'));
                  _fs2.default.unlink(path);
                  log(_chalk2.default.green(path + ' is removed'));
                });

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function findAndRemovePluginSetting(_x2) {
        return _ref2.apply(this, arguments);
      }

      return findAndRemovePluginSetting;
    }()
  }, {
    key: 'findAndRemovePlugs',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(pluginToSearch, vimrcContent) {
        var _this2 = this;

        var mapper, plugins, questions, answers, pluginsToRemove;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                mapper = this.buildPluginAndLineIndexMapper(pluginToSearch, vimrcContent);
                plugins = Object.keys(mapper);

                if (!(plugins.length === 0)) {
                  _context3.next = 5;
                  break;
                }

                log(_chalk2.default.yellow('Found no plugins that match ' + pluginToSearch));
                return _context3.abrupt('return', Promise.resolve());

              case 5:
                questions = plugins.map(function (plugin, index) {
                  return {
                    type: 'confirm',
                    // Need to use index here, plugin could contain periods
                    name: index + 1,
                    message: 'Found ' + plugin + '. You sure you want to remove it?'
                  };
                });
                _context3.next = 8;
                return _inquirer2.default.prompt(questions);

              case 8:
                answers = _context3.sent;
                pluginsToRemove = Object.keys(answers).filter(function (index) {
                  return answers[index];
                }).map(function (index) {
                  return plugins[index - 1];
                });


                pluginsToRemove.forEach(function (plugin) {
                  log(_chalk2.default.green('Removing ' + plugin + '...'));
                  _this2.removePlug(plugin, mapper, vimrcContent);
                  log(_chalk2.default.green(plugin + ' is removed'));
                });

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function findAndRemovePlugs(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return findAndRemovePlugs;
    }()
  }, {
    key: 'getVimrcContent',
    value: function getVimrcContent() {
      return _fs2.default.readFileSync(this.vimrc, 'utf8');
    }
  }, {
    key: 'buildPluginAndLineIndexMapper',
    value: function buildPluginAndLineIndexMapper(plugin, vimrcContent) {
      var regex = new RegExp('Plug \'(\\S*' + plugin + '\\S*)\'', 'i');

      var lines = vimrcContent.split(_os.EOL);

      var mapper = lines.reduce(function (acc, line, lineIndex) {
        var _ref4 = regex.exec(line) || [],
            _ref5 = _slicedToArray(_ref4, 2),
            plugin = _ref5[1];

        if (plugin) {
          acc[plugin] = lineIndex;
        }

        return acc;
      }, {});

      return mapper;
    }
  }, {
    key: 'removePlug',
    value: function removePlug(plugin, mapper, vimrcContent) {
      var lineIndex = mapper[plugin];

      var lines = vimrcContent.split(_os.EOL);

      var line = lines[lineIndex];

      var plug = 'Plug \'' + plugin + '\'';

      if (line.includes(plug + ', {') || line.includes(plug + ',{')) {
        line = line.replace(new RegExp('(' + plug + ')(,\\s*{\\.+})'), '$1');
      }

      var newLine = line.includes('|') ? line.split('|').filter(function (plugItem) {
        return !plugItem.includes(plug);
      }).join('|') : line.replace(plug, '');

      lines[lineIndex] = newLine;

      _fs2.default.writeFileSync(this.vimrc, lines.join(_os.EOL));
    }
  }]);

  return VimPlug;
}();

exports.default = VimPlug;