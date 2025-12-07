import Router from 'koa-router'
import _ from 'lodash'
import { URL } from 'url'
import constant from 'const'
import vmRunCode from '#utils/vmRunCode.js'

const route = new Router();

route.get('/crawl', async ({ request, models, response }) => {
  const rules = await models.MSpider.getAll({ where: { status: 4 }, lean: false })
  const white_list = new Set();
  rules.forEach(rule => {
    white_list.add((new URL(rule.pattern)).origin)
  });
  response.body = Array.from(white_list);
})

route.patch('/crawl', async ({ request, params, models, response }) => {
  const u = new URL(request.body.url);
  const rules = await models.MSpider.getAll({ where: { status: 4, pattern: { $regex: u.origin } }, lean: false })
  let rule = null, param;
  for (let i = 0; i < rules.length; i++) {
    rule = rules[i];
    param = rule.getParams(request.body.url);
    if (param && param.id) {
      break;
    }
  }
  let code = constant.STATUS.INITIAL, message = '匹配到规则但没数据';
  if (param && param.id) {
    const url = rule.getPureUrl(request.body.url);
    const resource_id = rule.getResourceId(param.id)
    const record = await models.MRecord.model.findOne({ source_id: param.id, spider_id: rule._id }).lean(true);
    const resource = await models.MResource.model.findOne({ _id: record ? record._id : resource_id }).lean(true);
    if (record && resource) {
      switch (resource.status) {
        case constant.STATUS.DISCARD:
          code = constant.STATUS.DISCARD;
          message = '已废弃';
          break;
        case constant.STATUS.FAILURE:
          code = constant.STATUS.FAILURE;
          message = '抓取失败';
          break;
        case constant.STATUS.TRANSCODING:
          code = constant.STATUS.LOADING;
          message = '处理中';
          break;
        case constant.STATUS.LOADING:
          code = constant.STATUS.LOADING;
          message = '处理中';
          break;
        case constant.STATUS.INITIAL:
          code = constant.STATUS.LOADING;
          message = '处理中';
          break;
        default:
          code = constant.STATUS.SUCCESS;
          message = '抓取数据成功';
          break;
      }
    }
    response.success({ record: { _id: resource_id, source_id: param.id, spider_id: rule._id, origin: url, }, rule: _.omit(rule.toJSON(), ['headers', 'script', 'urls']) }, { code, message });
  } else {
    response.success(null, { code: -2, message: '未匹配到规则' })
  }
})

route.post('/crawl/:_id', async (ctx) => {
  const { request, params, models, response } = ctx;
  const rule = await models.MSpider.getInfo({ where: { _id: params._id }, lean: false });
  if (!rule) {
    return response.fail({ message: 'NotFound' })
  }
  if (![2, 3].includes(rule.status)) {
    return response.fail({ message: 'NotReady' })
  }
  const url = rule.getPureUrl(request.body.url);
  const param = rule.getParams(url);
  if (!param) {
    return response.fail({ message: '格式不匹配' })
  }
  const sandbox = await vmRunCode(rule.script, '');
  const fn = sandbox.context.module.exports;
  ctx.request.body.html = Buffer.from(ctx.request.body.html || '', 'base64').toString()
  const { error, data, message } = await fn(ctx, rule, { _id: rule.getResourceId(param.id), source_id: param.id, spider_id: rule._id, origin: url });
  response.body = { code: error ? -1 : 0, message, data }
})

export default route