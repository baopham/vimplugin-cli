'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confirm = undefined;

var confirm = exports.confirm = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(collection, question) {
    var questions, answers, confirmedItems;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            questions = collection.map(function (item, index) {
              return {
                type: 'confirm',
                // Need to use index here, item could contain periods
                name: index + 1,
                message: question(item)
              };
            });
            _context.next = 3;
            return _inquirer2.default.prompt(questions);

          case 3:
            answers = _context.sent;
            confirmedItems = Object.keys(answers).filter(function (index) {
              return answers[index];
            }).map(function (index) {
              return collection[index - 1];
            });
            return _context.abrupt('return', confirmedItems);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function confirm(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }