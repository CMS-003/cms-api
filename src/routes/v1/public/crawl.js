import Router from 'koa-router'
import _ from 'lodash'
import utils from '#services/component.js'
import constant from '#constant.js';
import { VMScript, NodeVM } from 'vm2';

const route = new Router();

route.patch('/crawl/:id', async (ctx) => {
  const { request, params, models, response } = ctx;
  const rule = await models.MSpider.getInfo({ where: { _id: params.id }, lean: true });
  if (!rule || rule.status !== 2) {
    return response.fail({ message: '不可用' });
  }
  const url = rule.getPureUrl(request.body.url);
  const code = new VMScript(rule.script).compile();
  const fn = new NodeVM({
    console: 'inherit',
    sandbox: {
      process: {
        env: process.env,
      },
    },
    require: {
      external: true,
      root: constant.PATH.ROOT,
      builtin: ['*']
    }
  }).run(code, {});
  await fn({ url, rule, ctx });
  response.success()
})

export default route