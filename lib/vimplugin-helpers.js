'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAndRemovePluginSettings = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var findAndRemovePluginSettings = exports.findAndRemovePluginSettings = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(pluginToSearch, settings) {
    var filenames, regex, settingFiles, questions, answers, settingsToRemove;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (_fs2.default.existsSync(settings)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', Promise.resolve());

          case 2:
            filenames = _fs2.default.readdirSync(settings);
            regex = new RegExp(pluginToSearch, 'i');
            settingFiles = filenames.filter(function (name) {
              return regex.test(name);
            }).map(function (name) {
              return _path2.default.join(settings, name);
            });
            questions = settingFiles.map(function (path, index) {
              return {
                type: 'confirm',
                name: index + 1,
                message: 'Found setting file: ' + path + '. You sure you want to remove it?'
              };
            });
            _context.next = 8;
            return _inquirer2.default.prompt(questions);

          case 8:
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

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function findAndRemovePluginSettings(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getVimrcContent = getVimrcContent;
exports.getVimrcLines = getVimrcLines;
exports.formVimrcContent = formVimrcContent;
exports.buildPluginAndLineIndexMapper = buildPluginAndLineIndexMapper;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _os = require('os');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = console.log;

function getVimrcContent(vimrc) {
  return _fs2.default.readFileSync(vimrc, 'utf8');
}

function getVimrcLines(vimrcContent) {
  return vimrcContent.split(_os.EOL);
}

function formVimrcContent(lines) {
  return lines.join(_os.EOL);
}

function buildPluginAndLineIndexMapper(regexAndGroups, vimrcContent) {
  var _regexAndGroups = _slicedToArray(regexAndGroups, 2),
      regex = _regexAndGroups[0],
      regexGroups = _regexAndGroups[1];

  var lines = getVimrcLines(vimrcContent);

  var mapper = lines.reduce(function (acc, line, lineIndex) {
    if (!regex.test(line)) {
      return acc;
    }

    var plugin = regex.exec(line)[regexGroups.Plugin];

    acc[plugin] = lineIndex;

    return acc;
  }, {});

  return mapper;
}