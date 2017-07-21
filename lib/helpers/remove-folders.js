'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAndRemoveFolders = undefined;

var findAndRemoveFolders = exports.findAndRemoveFolders = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(pluginToSearch, dir) {
    var regex, paths, question, foldersToRemove;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            regex = new RegExp((0, _regex.escapeRegExp)(pluginToSearch));
            paths = _fs2.default.readdirSync(dir).filter(function (name) {
              return regex.test(name);
            }).map(function (name) {
              return '' + _path2.default.join(dir, name);
            });

            question = function question(path) {
              return 'Found ' + path + '. You sure you want to remove it?';
            };

            _context.next = 5;
            return (0, _prompt.confirm)(paths, question);

          case 5:
            foldersToRemove = _context.sent;

            if (!(paths.length === 0)) {
              _context.next = 9;
              break;
            }

            (0, _log2.default)(_chalk2.default.yellow('Found no plugged folder for ' + pluginToSearch));
            return _context.abrupt('return');

          case 9:

            foldersToRemove.forEach(function (folder) {
              (0, _log2.default)(_chalk2.default.green('Removing ' + folder + '...'));
              _rimraf2.default.sync(folder);
              (0, _log2.default)(_chalk2.default.green(folder + ' is removed'));
            });

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function findAndRemoveFolders(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _regex = require('./regex');

var _prompt = require('./prompt');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }