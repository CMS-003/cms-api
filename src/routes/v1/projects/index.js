const Router = require('koa-router')
const _ = require('lodash');
const uuid = require('uuid');

const project = new Router({
  prefix: '',
});

project.get('/', async ({ BLL, response }) => {
  const items = await BLL.projectBLL.getList({});
  response.success({ items });
})

project.get('/:id', async ({ params, req, BLL, response }) => {
  const where = { _id: params.id };
  const item = await BLL.projectBLL.getInfo({ where });
  response.success({ item });
})

project.post('/', async ({ request, response, BLL }) => {
  const data = _.pick(request.body, ['title', 'name', 'desc', 'cover']);
  data._id = uuid.v4();
  const item = await BLL.projectBLL.create(data);
  response.success({ item });
});

project.put('/:id', async ({ params, request, response, BLL }) => {
  const where = { _id: params.id };
  const data = _.pick(request.body, ['name', 'desc', 'cover']);
  const item = await BLL.projectBLL.update({ where, data });
  response.success({ item });
});

project.delete('/:id', async ({ params, request, response, BLL }) => {
  const where = { _id: params.id };
  await BLL.projectBLL.destroy({ where });
  response.success();
});

module.exports = project