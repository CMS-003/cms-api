import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'

const router = new Router({
  prefix: '',
});

router.get('/', async ({ models, request, response }) => {
  const hql = request.paginate()
  hql.sort = { order: 1, updatedAt: -1 }
  const items = await models.MWidget.getAll(hql);
  response.success({ items });
})

router.get('/:id', async ({ params, req, models, response }) => {
  const where = { _id: params.id };
  const item = await models.MWidget.getInfo({ where });
  response.success({ item });
})

router.post('/', async ({ request, response, models }) => {
  const data = request.body;
  if (!data._id) {
    data._id = v4();
  }
  const item = await models.MWidget.create(data);
  response.success({ item });
});

router.put('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  request.body.updatedAt = new Date()
  const data = request.body;
  const item = await models.MWidget.update({ where, data });
  response.success({ item });
});
router.delete('/:id', async ({ params, response, models }) => {
  const where = { _id: params.id };
  await models.MWidget.destroy({ where });
  response.success();
});

export default router