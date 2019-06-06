"use strict";

/**
 * @author [Double]
 * @email [2637309949@mail.com]
 * @create date 2018-09-02 12:51:45
 * @modify date 2018-09-02 12:51:45
 * @desc [logger]
*/
const winston = require('winston');

const path = require('path');

const {
  combine,
  timestamp,
  printf,
  colorize
} = winston.format;
const format = combine(colorize(), timestamp(), printf((_ref) => {
  let {
    level,
    message,
    timestamp
  } = _ref;
  return `[${level}]: ${timestamp} ${message}`;
}));
winston.addColors({
  'http': 'cyan'
});

module.exports = (_ref2) => {
  let {
    logger: {
      service,
      maxsize,
      path: _path
    }
  } = _ref2;
  return winston.createLogger({
    level: 'http',
    format,
    defaultMeta: {
      service
    },
    transports: [new winston.transports.File({
      filename: path.join(_path, 'http.log'),
      level: 'http',
      maxsize
    }), new winston.transports.File({
      filename: path.join(_path, 'combined.log'),
      maxsize
    }), new winston.transports.Console({
      format
    })]
  });
};