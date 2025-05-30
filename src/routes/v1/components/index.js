import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'
import { remCacheByIDs } from '#services/component.js';

const router = new Router({
  prefix: '',
});

router.get('/', async ({ models, state, request, response }) => {
  const hql = request.paginate()
  if (request.query.project_id) {
    hql.where.project_id = request.query.project_id;
  }
  hql.sort = { sort: 1, updatedAt: -1 }
  const total = await models.MComponent.count(hql);
  const items = await models.MComponent.getList(hql);
  response.success({ total, items });
})

router.get('/:id', async ({ params, req, models, response }) => {
  const where = { _id: params.id };
  const item = await models.MComponent.getInfo({ where });
  response.success({ item });
})

router.post('/', async ({ state, request, response, models }) => {
  const data = request.body;
  data._id = v4();
  data.project_id = state.project_id
  const item = await models.MComponent.create(data);
  await remCacheByIDs([data._id])
  response.success({ item });
});

router.post('/batch', async ({ request, response, models }) => {
  const info = request.body;
  const arr = info.map(({ _id, ...data }) => {
    data.updatedAt = new Date();
    return {
      updateOne: {
        filter: { _id },
        update: { $set: data },
        upsert: true,
      }
    }
  });
  if (arr.length) {
    const r = await models.MComponent.model.bulkWrite(arr);
    await remCacheByIDs(info.map(v => v._id))
  }
  response.success();
});

router.delete('/batch', async ({ request, response, models }) => {
  const ids = request.query.ids.toString().split(',');
  await remCacheByIDs(ids)
  await models.MComponent.model.deleteMany({ _id: { $in: ids } });
  response.success();
});

router.put('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  const data = _.pick(request.body, ['name', 'desc', 'cover', 'icon', 'title', 'available', 'status', 'order', 'type', 'project_id', 'template_id', 'parent_id', 'attrs', 'updatedAt']);
  data.updatedAt = new Date();
  await remCacheByIDs([params.id])
  const item = await models.MComponent.update({ where, data });
  response.success(item);
});

router.delete('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  await remCacheByIDs([params.id])
  await models.MComponent.destroy({ where });
  response.success();
});

export default router