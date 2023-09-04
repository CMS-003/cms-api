const Router = require('koa-router')
const _ = require('lodash');
const uuid = require('uuid');

const ConfigRoute = new Router();

ConfigRoute.get('/', async ({ BLL, response }) => {
  const items = await BLL.configBLL.getList({});
  response.success({ items });
})

ConfigRoute.get('/:id', async ({ params, BLL, response }) => {
  const where = { _id: params.id };
  const item = await BLL.configBLL.getInfo({ where });
  response.success({ item });
})

ConfigRoute.post('/', async ({ request, response, BLL }) => {
  const data = _.pick(request.body, ['project_id', 'name', 'desc', 'type', 'value', 'order']);
  data._id = uuid.v4();
  if (_.isNil(data.project_id)) {
    return response.throwBiz('COMMON.NeedParam', { param: 'project_id' })
  }
  const item = await BLL.configBLL.create(data);
  response.success({ item });
});

ConfigRoute.put('/:id', async ({ params, request, response, BLL }) => {
  const where = { _id: params.id };
  const data = _.pick(request.body, ['project_id', 'name', 'desc', 'type', 'value', 'order']);
  if (_.isNil(data.project_id)) {
    return response.throwBiz('COMMON.NeedParam', { param: 'project_id' })
  }
  await BLL.configBLL.update(where, { $set: data });
  response.success();
});

module.exports = ConfigRoute