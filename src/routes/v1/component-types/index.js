import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'

const router = new Router({
  prefix: '',
});

router.get('/', async ({ models, request, response }) => {
  const hql = request.paginate()
  hql.sort = { order: 1, level: 1 }
  const items = await models.MComponentType.getAll(hql);
  response.success({ items });
})

router.get('/:id', async ({ params, req, models, response }) => {
  const where = { _id: params.id };
  const item = await models.MComponentType.getInfo({ where });
  response.success({ item });
})

router.post('/', async ({ request, response, models }) => {
  const data = request.body;
  data._id = v4();
  data.createdAt = new Date();
  data.updatedAt = new Date();
  const item = await models.MComponentType.create(data);
  response.success({ item });
});

router.put('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  request.body.updatedAt = new Date()
  const data = { $set: request.body };
  const item = await models.MComponentType.update({ where, data });
  response.success({ item });
});
router.delete('/:id', async ({ params, response, models }) => {
  const where = { _id: params.id };
  await models.MComponentType.destroy({ where });
  response.success();
});

export default router