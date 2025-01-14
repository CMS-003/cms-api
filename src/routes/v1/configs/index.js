import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'


const router = new Router();

router.get('/', async ({ models, response, request }) => {
  const hql = request.paging();
  hql.sort = { type: 1 };
  hql.lean = true;
  if (request.query.type) {
    hql.where = { type: request.query.type }
  }
  const items = await models.MConfig.getAll(hql);
  response.success({ items });
})

router.get('/:id', async ({ params, models, response }) => {
  const where = { _id: params.id };
  const item = await models.MConfig.getInfo({ where });
  response.success({ item });
})

router.post('/', async ({ loadConfig, request, response, models }) => {
  const data = _.pick(request.body, ['id', 'project_id', 'title', 'desc', 'type', 'value', 'order', 'createdAt', 'updatedAt']);
  data.createdAt = new Date();
  data.updatedAt = new Date();
  const item = await models.MConfig.create(data);
  await loadConfig();
  response.success({ item });
});

router.put('/:id', async ({ loadConfig, params, request, response, models }) => {
  const where = { _id: params.id };
  const data = _.pick(request.body, ['project_id', 'name', 'desc', 'title', 'type', 'value', 'order', 'updatedAt']);
  data.updatedAt = new Date();
  await models.MConfig.update({ where, data: { $set: data } });
  await loadConfig();
  response.success();
});

router.del('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  await models.MConfig.destroy({ where });
  response.success();
});

export default router