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
    value: function remove(pluginToSearch) {
      var _this = this;

      var vimrcContent = this.getVimrcContent();

      this.findAndRemovePlugs(pluginToSearch, vimrcContent).then(function () {
        return _this.findAndRemovePluginSetting(pluginToSearch);
      });
    }
  }, {
    key: 'findAndRemovePluginSetting',
    value: function findAndRemovePluginSetting(pluginToSearch) {
      var _this2 = this;

      if (!_fs2.default.existsSync(this.settings)) {
        return Promise.resolve();
      }

      var filenames = _fs2.default.readdirSync(this.settings);

      var regex = new RegExp(pluginToSearch, 'i');

      var settingFiles = filenames.filter(function (name) {
        return regex.test(name);
      }).map(function (name) {
        return _path2.default.join(_this2.settings, name);
      });

      var questions = settingFiles.map(function (path, index) {
        return {
          type: 'confirm',
          name: index + 1,
          message: 'Found setting file: ' + path + '. You sure you want to remove it?'
        };
      });

      return _inquirer2.default.prompt(questions).then(function (answers) {
        var settingsToRemove = Object.keys(answers).filter(function (index) {
          return answers[index];
        }).map(function (index) {
          return settingFiles[index - 1];
        });

        settingsToRemove.forEach(function (path) {
          log(_chalk2.default.green('Removing setting file ' + path + '...'));
          _fs2.default.unlink(path);
          log(_chalk2.default.green('Removed setting file ' + path));
        });
      });
    }
  }, {
    key: 'findAndRemovePlugs',
    value: function findAndRemovePlugs(pluginToSearch, vimrcContent) {
      var _this3 = this;

      var mapper = this.buildPluginAndLineIndexMapper(pluginToSearch, vimrcContent);

      var plugins = Object.keys(mapper);

      if (plugins.length === 0) {
        log(_chalk2.default.yellow('Found no plugins that match ' + pluginToSearch));
        return Promise.resolve();
      }

      var questions = plugins.map(function (plugin, index) {
        return {
          type: 'confirm',
          // Need to use index here, plugin could contain periods
          name: index + 1,
          message: 'Found ' + plugin + '. You sure you want to remove it?'
        };
      });

      return _inquirer2.default.prompt(questions).then(function (answers) {
        var pluginsToRemove = Object.keys(answers).filter(function (index) {
          return answers[index];
        }).map(function (index) {
          return plugins[index - 1];
        });

        pluginsToRemove.forEach(function (plugin) {
          log(_chalk2.default.green('Removing ' + plugin + '...'));
          _this3.removePlug(plugin, mapper, vimrcContent);
          log(_chalk2.default.green(plugin + ' is removed'));
        });
      });
    }
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
        var _ref = regex.exec(line) || [],
            _ref2 = _slicedToArray(_ref, 2),
            plugin = _ref2[1];

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