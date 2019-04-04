/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-09 16:55:19
 * @modify date 2019-01-09 16:55:19
 * @desc [log]
 */
const assert = require('assert').strict
const is = require('is')
const moment = require('moment')
const utils = require('./utils')
const logger = require('juglans-addition').logger

function formatPrint ({ formatTime, type, method, href }) {
  return `${formatTime} [${type}] ${method} ${href}`
}

module.exports = ({ record = () => {} }) => async function ({ router, config }) {
  const { prefix } = config
  const httpLogger = logger.createHttpLogger(config).http
  assert.ok(is.function(record), 'Record parameter should be func type')
  router.use(async function (ctx, next) {
    try {
      let logInfo
      const start = Date.now()
      const accessData = ctx.state.accessData
      const formatTime = moment().format('YYYY-MM-DD HH:mm:ss')
      const reqForm = {
        href: ctx.request.href,
        method: ctx.method.toUpperCase(),
        headers: ctx.headers,
        payload: ctx.request.body,
        netaddress: ctx.ip,
        accessData
      }
      if (accessData) {
        reqForm.accessData = accessData
        if (reqForm.requestUrl.startsWith(prefix)) {
          logInfo = formatPrint({ formatTime, type: reqForm.accessData.username, method: reqForm.method, href: reqForm.href })
          record(reqForm)
        }
      } else if (ctx.state.fakeToken) {
        logInfo = formatPrint({ formatTime, type: 'FT', method: reqForm.method, href: reqForm.href })
      } else if (ctx.state.fakeUrl) {
        logInfo = formatPrint({ formatTime, type: 'FU', method: reqForm.method, href: reqForm.href })
      } else {
        logInfo = formatPrint({ formatTime, type: 'UD', method: reqForm.method, href: reqForm.href })
      }
      httpLogger(`=> ${logInfo}`)
      await next()
      const { delta, status } = utils.measure(start, Date.now(), ctx)
      httpLogger(`<= ${logInfo} ${status} ${delta}`)
    } catch (err) {
      throw err
    }
  })
}
