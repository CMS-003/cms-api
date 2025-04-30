import Router from 'koa-router'
import http from 'http'
import https from 'https'
import _ from 'lodash'
import config from '#config/index.js';
import vmRunCode from '#utils/vmRunCode.js';

const home = new Router();

home.get('/', async (ctx) => {
  console.log('home')
  ctx.body = 'Hello World!';
})

home.post('test/email', async (ctx) => {
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
  if (ctx.mailer) {
    ctx.mailer.sendMail(data.users, data.subject, data.html);
    ctx.response.success()
  } else {
    ctx.response.throwBiz('COMMON.NeedParam', { param: 'config' })
  }
})

const gatling = new Router();
gatling.all('/:_id', async (ctx) => {
  const { params, models, response } = ctx;
  const where = { _id: params._id };
  const api = await models.MInterface.getInfo({ where, lean: true });
  if (api && api.method === 'all' || api.method === ctx.request.method.toLocaleUpperCase()) {
    const sandbox = await vmRunCode(api.script);
    await sandbox.context.module.exports(ctx);
  } else {
    response.fail();
  }
});
home.use('gatling', gatling.routes(), gatling.allowedMethods());

export default home