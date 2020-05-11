/* eslint-env node, mocha */
'use strict';

var _chai = require("chai");

var _lib = require("../lib");

require("@babel/polyfill");

var _sinon = _interopRequireDefault(require("sinon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

before(function () {
  global.bundle = {
    identifier: 'com.dizmo.my-dizmo'
  };
  global.viewer = {
    getAttribute: function getAttribute() {
      return 'en';
    }
  };
});
describe('i18n', function () {
  it('should exist', function () {
    (0, _chai.expect)(_lib.i18n).to.not.be.an('undefined');
  });
  it('should be a function', function () {
    (0, _chai.expect)(_lib.i18n).to.be.a('function');
  });
});
describe('i18n w/callbacks', function () {
  var requests = [];
  before(function () {
    global.XMLHttpRequest = _sinon["default"].useFakeXMLHttpRequest();

    global.XMLHttpRequest.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });
  after(function () {
    global.XMLHttpRequest.restore();
  });
  it('should return a translator', function () {
    (0, _lib.i18n)(function (error, t) {
      (0, _chai.expect)(error).to.equal(null);
      (0, _chai.expect)(t).to.be.a('function');
    });
    requests[0].respond(200, {
      'Content-Type': 'application/json'
    }, JSON.stringify({
      '#front': {
        'greeting': 'Hello World!'
      }
    }));
    requests.shift();
  });
  it('should return an error', function () {
    (0, _lib.i18n)(function (error, t) {
      (0, _chai.expect)(error).to.equal('Not Found');
      (0, _chai.expect)(t).to.eq(null);
    });
    requests[0].respond(404);
    requests.shift();
  });
});
describe('i18n w/await', function () {
  describe('for status: 200 OK', function () {
    beforeEach(function () {
      global.XMLHttpRequest = _sinon["default"].useFakeXMLHttpRequest();

      global.XMLHttpRequest.onCreate = function (xhr) {
        setTimeout(function () {
          xhr.respond(200, {
            'Content-Type': 'application/json'
          }, JSON.stringify({
            '#front': {
              'greeting': 'Hello World!'
            }
          }));
        }, 0);
      };
    });
    afterEach(function () {
      global.XMLHttpRequest.restore();
    });
    it('should await translator', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var t;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context.sent;
              (0, _chai.expect)(t).to.be.a('function');

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it('should translate key of `null`', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var t, value;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context2.sent;
              (0, _chai.expect)(t).to.be.a('function');
              value = t(null);
              (0, _chai.expect)(value).to.equal(undefined);

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it('should translate key of `undefined`', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var t, value;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context3.sent;
              (0, _chai.expect)(t).to.be.a('function');
              value = t();
              (0, _chai.expect)(value).to.deep.equal({
                '#front': {
                  greeting: 'Hello World!'
                }
              });
              (0, _chai.expect)(t(undefined)).to.deep.equal({
                '#front': {
                  greeting: 'Hello World!'
                }
              });

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it('should translate key of `(empty)`', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var t, value;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context4.sent;
              (0, _chai.expect)(t).to.be.a('function');
              value = t('');
              (0, _chai.expect)(value).to.deep.equal({
                '#front': {
                  greeting: 'Hello World!'
                }
              });

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it('should translate key of `#front`', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var t, value;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context5.sent;
              (0, _chai.expect)(t).to.be.a('function');
              value = t('#front');
              (0, _chai.expect)(value).to.deep.equal({
                greeting: 'Hello World!'
              });

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    it('should translate key of `#front/greeting`', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var t, value;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context6.sent;
              (0, _chai.expect)(t).to.be.a('function');
              value = t('#front/greeting');
              (0, _chai.expect)(value).to.equal('Hello World!');

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    it('should translate key of `#front.greeting`', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var t, value;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context7.sent;
              (0, _chai.expect)(t).to.be.a('function');
              value = t('#front.greeting');
              (0, _chai.expect)(value).to.equal('Hello World!');

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    it('should translate key of `#front:greeting`', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
      var t, value;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context8.sent;
              (0, _chai.expect)(t).to.be.a('function');
              value = t('#front:greeting', /:/);
              (0, _chai.expect)(value).to.equal('Hello World!');

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
    it('should translate key of `#front|greeting`', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
      var t, value;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context9.sent;
              (0, _chai.expect)(t).to.be.a('function');
              value = t('#front|greeting', '|');
              (0, _chai.expect)(value).to.equal('Hello World!');

            case 6:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
    it('should translate key of `#front/greeting/random`', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
      var t, value;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context10.sent;
              (0, _chai.expect)(t).to.be.a('function');
              value = t('#front/greeting/random');
              (0, _chai.expect)(value).to.equal(undefined);

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
    it('should translate key of `#front.greeting.random`', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
      var t, value;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return (0, _lib.i18n)();

            case 2:
              t = _context11.sent;
              (0, _chai.expect)(t).to.be.a('function');
              value = t('#front.greeting.random');
              (0, _chai.expect)(value).to.equal(undefined);

            case 6:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
  });
  describe('for status: 404 Not Found', function () {
    before(function () {
      global.XMLHttpRequest = _sinon["default"].useFakeXMLHttpRequest();

      global.XMLHttpRequest.onCreate = function (xhr) {
        setTimeout(function () {
          return xhr.respond(404);
        }, 0);
      };
    });
    after(function () {
      global.XMLHttpRequest.restore();
    });
    it('should await error', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
      var t;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              _context12.next = 3;
              return (0, _lib.i18n)();

            case 3:
              t = _context12.sent;
              _context12.next = 9;
              break;

            case 6:
              _context12.prev = 6;
              _context12.t0 = _context12["catch"](0);
              (0, _chai.expect)(_context12.t0).to.equal('Not Found');

            case 9:
              (0, _chai.expect)(t).to.be.an('undefined');

            case 10:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, null, [[0, 6]]);
    })));
  });
});
//# sourceMappingURL=test.js.map