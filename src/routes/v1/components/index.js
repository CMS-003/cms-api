const Router = require('koa-router')
const _ = require('lodash');
const uuid = require('uuid');

const ComponentRoute = new Router({
  prefix: '',
});

ComponentRoute.get('/', async ({ BLL, response }) => {
  const items = await BLL.componentBLL.getList({});
  response.success({ items });
})

ComponentRoute.get('/:id', async ({ params, req, BLL, response }) => {
  const where = { _id: params.id };
  const item = await BLL.componentBLL.getInfo({ where });
  response.success({ item });
})

ComponentRoute.post('/', async ({ request, response, BLL }) => {
  const data = request.body;
  data._id = uuid.v4();
  const item = await BLL.componentBLL.create(data);
  response.success({ item });
});

ComponentRoute.put('/:id', async ({ params, request, response, BLL }) => {
  const where = { _id: params.id };
  const data = _.pick(request.body, ['name', 'desc', 'cover']);
  const item = await BLL.componentBLL.update(where, { $set: data });
  response.success();
});

module.exports = ComponentRoute