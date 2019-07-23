"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const path = require('path');

const additions = require('juglans-addition');

const logger = additions.logger;
const winston = logger.winston;
winston.addColors({
  'http': 'cyan'
});

module.exports = (_ref) => {
  let {
    service,
    maxsize,
    path: dir
  } = _ref;
  return logger.add(new winston.transports.File({
    filename: path.join(dir, 'http.log'),
    level: 'http',
    maxsize
  }));
};