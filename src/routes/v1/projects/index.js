import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'


const project = new Router({
  prefix: '',
});

project.get('/', async ({ models, response }) => {
  const items = await models.Project.getList({});
  response.success({ items });
})

project.get('/:id', async ({ params, req, models, response }) => {
  const where = { _id: params.id };
  const item = await models.Project.getInfo({ where });
  response.success({ item });
})

project.post('/', async ({ request, response, models }) => {
  const data = _.pick(request.body, ['title', 'name', 'desc', 'cover']);
  data._id = v4();
  const item = await models.Project.create(data);
  response.success({ item });
});

project.put('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  const data = _.pick(request.body, ['name', 'desc', 'cover']);
  const item = await models.Project.update({ where, data });
  response.success({ item });
});

project.delete('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  await models.Project.destroy({ where });
  response.success();
});

export default project