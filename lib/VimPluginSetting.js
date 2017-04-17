'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _vimpluginHelpers = require('./vimplugin-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = console.log;

var VimPluginSetting = function () {
  function VimPluginSetting(settings) {
    _classCallCheck(this, VimPluginSetting);

    this.settings = settings;

    Object.freeze(this);
  }

  _createClass(VimPluginSetting, [{
    key: 'findAll',
    value: function findAll(pluginToSearch) {
      var _this = this;

      if (!_fs2.default.existsSync(this.settings)) {
        return [];
      }

      var filenames = _fs2.default.readdirSync(this.settings);

      var regex = new RegExp((0, _vimpluginHelpers.escapeRegExp)(pluginToSearch), 'i');

      var settingFiles = filenames.filter(function (name) {
        return regex.test(name);
      }).map(function (name) {
        return _path2.default.join(_this.settings, name);
      });

      return settingFiles;
    }
  }, {
    key: 'findAndRemove',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(pluginToSearch) {
        var settingFiles, questions, answers, settingsToRemove;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                settingFiles = this.findAll(pluginToSearch);

                if (settingFiles.length) {
                  _context.next = 4;
                  break;
                }

                log(_chalk2.default.yellow('Could not find any plugin setting for ' + pluginToSearch));
                return _context.abrupt('return');

              case 4:
                questions = settingFiles.map(function (path, index) {
                  return {
                    type: 'confirm',
                    name: index + 1,
                    message: 'Found setting file: ' + path + '. You sure you want to remove it?'
                  };
                });
                _context.next = 7;
                return _inquirer2.default.prompt(questions);

              case 7:
                answers = _context.sent;
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

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function findAndRemove(_x) {
        return _ref.apply(this, arguments);
      }

      return findAndRemove;
    }()
  }, {
    key: 'findAndOpen',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(pluginToSearch) {
        var settingFiles, questions, answers, settingsToOpen;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                settingFiles = this.findAll(pluginToSearch);

                if (settingFiles.length) {
                  _context2.next = 4;
                  break;
                }

                log(_chalk2.default.yellow('Could not find any plugin setting for ' + pluginToSearch));
                return _context2.abrupt('return');

              case 4:
                questions = settingFiles.map(function (path, index) {
                  return {
                    type: 'confirm',
                    name: index + 1,
                    message: 'Found setting file: ' + path + '. Open it?'
                  };
                });
                _context2.next = 7;
                return _inquirer2.default.prompt(questions);

              case 7:
                answers = _context2.sent;
                settingsToOpen = Object.keys(answers).filter(function (index) {
                  return answers[index];
                }).map(function (index) {
                  return settingFiles[index - 1];
                });


                settingsToOpen.forEach(_opn2.default);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function findAndOpen(_x2) {
        return _ref2.apply(this, arguments);
      }

      return findAndOpen;
    }()
  }]);

  return VimPluginSetting;
}();

exports.default = VimPluginSetting;