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
const deepmerge = require('deepmerge');

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

function defaultFormat(payload, ctx) {
  let type;

  if (payload.accessData) {
    type = payload.accessData.username;
  } else if (ctx.state.fakeToken) {
    type = 'FT';
  } else if (ctx.state.fakeUrl) {
    type = 'FU';
  } else {
    type = 'UD';
  }

  if (payload.type === 'IN') {
    return `=> ${formatPrint({
      formatTime: moment(payload.startUnix, 'X').format('YYYY-MM-DD HH:mm:ss'),
      type,
      method: payload.method,
      href: payload.url
    })}`;
  } else if (payload.type === 'OUT') {
    return `<= ${formatPrint({
      formatTime: moment(payload.startUnix, 'X').format('YYYY-MM-DD HH:mm:ss'),
      type,
      method: payload.method,
      href: payload.url
    })}`;
  }
}

module.exports = cfg =>
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (_ref2) {
    let {
      router,
      config
    } = _ref2;
    cfg = deepmerge.all([cfg, config]);
    const httpLogger = logger.createHttpLogger(cfg).http;
    cfg.format = cfg.format || defaultFormat;
    router.use(
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(function* (ctx, next) {
        try {
          const start = Date.now();
          const reqForm = {};
          reqForm.startUnix = moment().unix();
          reqForm.type = 'IN';
          reqForm.method = ctx.method.toUpperCase();
          reqForm.ip = ctx.ip;
          reqForm.url = ctx.request.href;
          reqForm.accessData = ctx.state.accessData;
          let info = cfg.format(reqForm, ctx);
          httpLogger(info);
          yield next();
          reqForm.type = 'OUT';
          reqForm.endUnix = moment().unix();
          reqForm.latency = reqForm.endUnix - reqForm.startUnix;
          const {
            delta,
            status
          } = utils.measure(start, Date.now(), ctx);
          info = cfg.format(reqForm, ctx);
          httpLogger(`${info} ${status} ${delta}`);
        } catch (err) {
          throw err;
        }
      });

      return function (_x2, _x3) {
        return _ref4.apply(this, arguments);
      };
    }());
  });

  return function (_x) {
    return _ref3.apply(this, arguments);
  };
}();