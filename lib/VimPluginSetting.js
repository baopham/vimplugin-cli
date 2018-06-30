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

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _log = require('./helpers/log');

var _log2 = _interopRequireDefault(_log);

var _regex = require('./helpers/regex');

var _prompt = require('./helpers/prompt');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

      var regex = new RegExp((0, _regex.escapeRegExp)(pluginToSearch), 'i');

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
        var settingFiles, question, settingsToRemove;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                settingFiles = this.findAll(pluginToSearch);

                if (settingFiles.length) {
                  _context.next = 4;
                  break;
                }

                (0, _log2.default)(_chalk2.default.yellow('Could not find any plugin setting for ' + pluginToSearch));
                return _context.abrupt('return');

              case 4:
                question = function question(path) {
                  return 'Found setting file: ' + path + '. You sure you want to remove it?';
                };

                _context.next = 7;
                return (0, _prompt.confirm)(settingFiles, question);

              case 7:
                settingsToRemove = _context.sent;


                settingsToRemove.forEach(function (path) {
                  (0, _log2.default)(_chalk2.default.green('Removing setting file ' + path + '...'));
                  _fs2.default.unlinkSync(path);
                  (0, _log2.default)(_chalk2.default.green(path + ' is removed'));
                });

              case 9:
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
        var settingFiles, question, settingsToOpen;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                settingFiles = this.findAll(pluginToSearch);

                if (settingFiles.length) {
                  _context2.next = 4;
                  break;
                }

                (0, _log2.default)(_chalk2.default.yellow('Could not find any plugin setting for ' + pluginToSearch));
                return _context2.abrupt('return');

              case 4:
                question = function question(path) {
                  return 'Found setting file: ' + path + '. Open it?';
                };

                _context2.next = 7;
                return (0, _prompt.confirm)(settingFiles, question);

              case 7:
                settingsToOpen = _context2.sent;


                settingsToOpen.forEach(_opn2.default);

              case 9:
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