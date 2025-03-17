import Router from 'koa-router'
import _ from 'lodash'
import utils from '#services/component.js'
import constant from '#constant.js';
import { VMScript, NodeVM } from 'vm2';

const route = new Router();

route.patch('/crawl/', async (ctx) => {
  const { request, params, models, response } = ctx;

  const u = new URL(request.body.url);
  const rules = await models.MSpider.getAll({ where: { status: 2, pattern: { $regex: u.origin } }, lean: false })
  let rule = null, param;
  for (let i = 0; i < rules.length; i++) {
    rule = rules[i];
    param = rule.getParams(request.body.url);
    if (param) {
      break;
    }
  }
  if (rule && param) {
    console.log(rule, param)
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
    await fn({ url, rule, param, ctx });
  } else {
    response.fail()
  }
})

export default route