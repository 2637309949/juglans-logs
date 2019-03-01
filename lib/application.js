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

module.exports = ({ record = () => {} }) => async function ({ router, config: { prefix } }) {
  assert.ok(is.function(record), 'record should be func type')
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
          logInfo = `${formatTime} [${reqForm.accessData.username}] ${reqForm.method} ${reqForm.href}`
          await record(reqForm)
        }
      } else if (ctx.state.fakeToken) {
        logInfo = `${formatTime} [FT]: ${reqForm.method} ${reqForm.href}`
      } else if (ctx.state.fakeUrl) {
        logInfo = `${formatTime} [FU]: ${reqForm.method} ${reqForm.href}`
      } else {
        logInfo = `${formatTime} [UD]: ${reqForm.method} ${reqForm.href}`
      }
      await next()
      const { delta, status } = utils.measure(start, Date.now(), ctx)
      console.log(`=> ${logInfo} ${status} ${delta}`)
    } catch (err) {
      throw err
    }
  })
}
