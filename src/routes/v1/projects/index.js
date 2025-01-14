import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'

const router = new Router({
  prefix: '',
});

router.get('/', async ({ models, response }) => {
  const items = await models.MProject.getList({});
  response.success({ items });
})

router.get('/:id', async ({ params, req, models, response }) => {
  const where = { _id: params.id };
  const item = await models.MProject.getInfo({ where });
  response.success({ item });
})

router.post('/', async ({ request, response, models }) => {
  const data = _.pick(request.body, ['_id', 'title', 'name', 'desc', 'cover']);
  data._id = v4();
  const item = await models.MProject.create(data);
  response.success({ item });
});

router.put('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  const data = _.pick(request.body, ['name', 'desc', 'cover']);
  const item = await models.MProject.update({ where, data });
  response.success({ item });
});

router.delete('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  await models.MProject.destroy({ where });
  response.success();
});

export default router