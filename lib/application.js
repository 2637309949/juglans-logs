// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const deepmerge = require('deepmerge')
const moment = require('moment')
const path = require('path')
const utils = require('./utils')
const createLogger = require('./logger')

const FORMAT = ({ formatTime, type, method, href }) => `${formatTime} [${type}] ${method} ${href}`

const defaultOpts = {
  path: path.join(__dirname, '../../logger'),
  format (payload, ctx) {
    let type
    if (payload.accessData) {
      type = payload.accessData.username
    } else if (ctx.state.fakeToken) {
      type = 'FT'
    } else if (ctx.state.fakeUrl) {
      type = 'FU'
    } else {
      type = 'UD'
    }
    if (payload.type === 'IN') {
      return `=> ${FORMAT({
        formatTime: moment(payload.startUnix, 'X').format('YYYY-MM-DD HH:mm:ss'),
        type,
        method: payload.method,
        href: payload.url
      })}`
    } else if (payload.type === 'OUT') {
      return `<= ${FORMAT({
        formatTime: moment(payload.startUnix, 'X').format('YYYY-MM-DD HH:mm:ss'),
        type,
        method: payload.method,
        href: payload.url
      })}`
    }
  }
}

module.exports = cfg => async function ({ router }) {
  cfg = deepmerge.all([defaultOpts, cfg])
  const logger = createLogger(cfg)
  router.use(async function (ctx, next) {
    try {
      const start = Date.now()
      const reqForm = {}
      reqForm.startUnix = moment().unix()
      reqForm.type = 'IN'
      reqForm.method = ctx.method.toUpperCase()
      reqForm.ip = ctx.ip
      reqForm.url = ctx.request.url
      reqForm.accessData = ctx.state.accessData

      let info = cfg.format(reqForm, ctx)
      logger.http(info)
      await next()
      reqForm.type = 'OUT'
      reqForm.endUnix = moment().unix()
      reqForm.latency = reqForm.endUnix - reqForm.startUnix
      const { delta, status } = utils.measure(start, Date.now(), ctx)
      info = cfg.format(reqForm, ctx)
      logger.http(`${info} ${status} ${delta}`)
    } catch (err) {
      throw err
    }
  })
}
