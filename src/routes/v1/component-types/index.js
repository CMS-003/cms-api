import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'

const ComponentTypeRoute = new Router({
  prefix: '',
});

ComponentTypeRoute.get('/', async ({ models, request, response }) => {
  const hql = request.paging()
  hql.sort = { order: 1, updatedAt: -1 }
  const items = await models.ComponentType.getAll(hql);
  response.success({ items });
})

ComponentTypeRoute.get('/:id', async ({ params, req, models, response }) => {
  const where = { _id: params.id };
  const item = await models.ComponentType.getInfo({ where });
  response.success({ item });
})

ComponentTypeRoute.post('/', async ({ request, response, models }) => {
  const data = request.body;
  data._id = v4();
  const item = await models.ComponentType.create(data);
  response.success({ item });
});

ComponentTypeRoute.put('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  request.body.updatedAt = new Date()
  const data = request.body;
  const item = await models.ComponentType.update({ where, data });
  response.success({ item });
});
ComponentTypeRoute.delete('/:id', async ({ params, response, models }) => {
  const where = { _id: params.id };
  await models.ComponentType.destroy({ where });
  response.success();
});

export default ComponentTypeRoute