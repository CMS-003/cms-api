const Router = require('koa-router')
const _ = require('lodash');
const uuid = require('uuid');

const ComponentTypeRoute = new Router({
  prefix: '',
});

ComponentTypeRoute.get('/', async ({ BLL, request, response }) => {
  const hql = request.paging()
  hql.order = { order: 1, updatedAt: -1 }
  const items = await BLL.componentTypeBLL.getAll(hql);
  response.success({ items });
})

ComponentTypeRoute.get('/:id', async ({ params, req, BLL, response }) => {
  const where = { _id: params.id };
  const item = await BLL.componentTypeBLL.getInfo({ where });
  response.success({ item });
})

ComponentTypeRoute.post('/', async ({ request, response, BLL }) => {
  const data = request.body;
  data._id = uuid.v4();
  const item = await BLL.componentTypeBLL.create(data);
  response.success({ item });
});

ComponentTypeRoute.put('/:id', async ({ params, request, response, BLL }) => {
  const where = { _id: params.id };
  request.body.updatedAt = new Date()
  const data = request.body;
  const item = await BLL.componentTypeBLL.update({ where, data });
  response.success({ item });
});
ComponentTypeRoute.delete('/:id', async ({ params, response, BLL }) => {
  const where = { _id: params.id };
  await BLL.componentTypeBLL.destroy({ where });
  response.success();
});

module.exports = ComponentTypeRoute