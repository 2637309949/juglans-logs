// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const path = require('path')
const logger = require('juglans-addition').logger
const winston = logger.winston

const { combine, timestamp, printf, colorize } = winston.format
const format = combine(
  colorize(),
  timestamp(),
  printf(({ level, message, timestamp }) => {
    return `[${level}]: ${timestamp} ${message}`
  })
)

winston.addColors({
  'http': 'cyan'
})

module.exports = ({ service, maxsize, path: dir }) => winston.createLogger({
  level: 'http',
  format,
  defaultMeta: { service },
  transports: [
    new winston.transports.File({ filename: path.join(dir, 'http.log'), level: 'http', maxsize }),
    new winston.transports.File({ filename: path.join(dir, 'combined.log'), maxsize }),
    new winston.transports.Console({ format })
  ]
})
