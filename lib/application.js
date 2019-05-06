/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-09 16:55:19
 * @modify date 2019-01-09 16:55:19
 * @desc [log]
 */
const deepmerge = require('deepmerge')
const moment = require('moment')
const utils = require('./utils')
const logger = require('juglans-addition').logger

function formatPrint ({ formatTime, type, method, href }) {
  return `${formatTime} [${type}] ${method} ${href}`
}

function defaultFormat (payload, ctx) {
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
    return `=> ${formatPrint({
      formatTime: moment(payload.startUnix, 'X').format('YYYY-MM-DD HH:mm:ss'),
      type,
      method: payload.method,
      href: payload.url
    })}`
  } else if (payload.type === 'OUT') {
    return `<= ${formatPrint({
      formatTime: moment(payload.startUnix, 'X').format('YYYY-MM-DD HH:mm:ss'),
      type,
      method: payload.method,
      href: payload.url
    })}`
  }
}

module.exports = cfg => async function ({ router, config }) {
  cfg = deepmerge.all([cfg, config])
  const httpLogger = logger.createHttpLogger(cfg).http
  cfg.format = cfg.format || defaultFormat
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
      httpLogger(info)
      await next()
      reqForm.type = 'OUT'
      reqForm.endUnix = moment().unix()
      reqForm.latency = reqForm.endUnix - reqForm.startUnix
      const { delta, status } = utils.measure(start, Date.now(), ctx)
      info = cfg.format(reqForm, ctx)
      httpLogger(`${info} ${status} ${delta}`)
    } catch (err) {
      throw err
    }
  })
}
