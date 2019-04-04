"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-09 16:55:19
 * @modify date 2019-01-09 16:55:19
 * @desc [log]
 */
const assert = require('assert').strict;

const is = require('is');

const moment = require('moment');

const utils = require('./utils');

const logger = require('juglans-addition').logger;

function formatPrint(_ref) {
  let {
    formatTime,
    type,
    method,
    href
  } = _ref;
  return `${formatTime} [${type}] ${method} ${href}`;
}

module.exports = (_ref2) => {
  let {
    record = () => {}
  } = _ref2;
  return (
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(function* (_ref3) {
        let {
          router,
          config
        } = _ref3;
        const {
          prefix
        } = config;
        const httpLogger = logger.createHttpLogger(config).http;
        assert.ok(is.function(record), 'Record parameter should be func type');
        router.use(
        /*#__PURE__*/
        function () {
          var _ref5 = _asyncToGenerator(function* (ctx, next) {
            try {
              let logInfo;
              const start = Date.now();
              const accessData = ctx.state.accessData;
              const formatTime = moment().format('YYYY-MM-DD HH:mm:ss');
              const reqForm = {
                href: ctx.request.href,
                method: ctx.method.toUpperCase(),
                headers: ctx.headers,
                payload: ctx.request.body,
                netaddress: ctx.ip,
                accessData
              };

              if (accessData) {
                reqForm.accessData = accessData;

                if (reqForm.requestUrl.startsWith(prefix)) {
                  logInfo = formatPrint({
                    formatTime,
                    type: reqForm.accessData.username,
                    method: reqForm.method,
                    href: reqForm.href
                  });
                  record(reqForm);
                }
              } else if (ctx.state.fakeToken) {
                logInfo = formatPrint({
                  formatTime,
                  type: 'FT',
                  method: reqForm.method,
                  href: reqForm.href
                });
              } else if (ctx.state.fakeUrl) {
                logInfo = formatPrint({
                  formatTime,
                  type: 'FU',
                  method: reqForm.method,
                  href: reqForm.href
                });
              } else {
                logInfo = formatPrint({
                  formatTime,
                  type: 'UD',
                  method: reqForm.method,
                  href: reqForm.href
                });
              }

              httpLogger(`=> ${logInfo}`);
              yield next();
              const {
                delta,
                status
              } = utils.measure(start, Date.now(), ctx);
              httpLogger(`<= ${logInfo} ${status} ${delta}`);
            } catch (err) {
              throw err;
            }
          });

          return function (_x2, _x3) {
            return _ref5.apply(this, arguments);
          };
        }());
      });

      return function (_x) {
        return _ref4.apply(this, arguments);
      };
    }()
  );
};