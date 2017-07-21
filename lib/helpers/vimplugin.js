'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getVimrcContent = getVimrcContent;
exports.getVimrcLines = getVimrcLines;
exports.formVimrcContent = formVimrcContent;
exports.buildPluginAndLineIndexMapper = buildPluginAndLineIndexMapper;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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