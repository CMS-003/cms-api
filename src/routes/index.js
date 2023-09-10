const Router = require('koa-router')
const _ = require('lodash')
const Mailer = require('../utils/mailer')

const home = new Router();

home.get('/', async (ctx) => {
  console.log('home')
  ctx.body = 'Hello World!';
})

home.post('test/email', async (ctx) => {
  const config = await ctx.BLL.configBLL.getInfo({ where: { name: 'email' } });
  const data = _.pick(ctx.request.body, ['users', 'subject', 'html']);
  if (_.isEmpty(data.users)) {
    return ctx.response.throwBiz('COMMON.NeedParam', { param: 'users' })
  }
  if (_.isEmpty(data.subject)) {
    return ctx.response.throwBiz('COMMON.NeedParam', { param: 'subject' })
  }
  if (_.isEmpty(data.html)) {
    return ctx.response.throwBiz('COMMON.NeedParam', { param: 'html' })
  }
  if (config) {
    const mailer = new Mailer(config)
    mailer.sendMail(data.users, data.subject, data.html)
    ctx.response.success()
  } else {
    ctx.response.throwBiz('COMMON.NeedParam', { param: 'config' })
  }
})

module.exports = home