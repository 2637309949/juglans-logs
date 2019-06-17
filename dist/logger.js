"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
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