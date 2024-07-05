import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'


const ComponentRoute = new Router({
  prefix: '',
});

ComponentRoute.get('/', async ({ models, state, request, response }) => {
  const hql = request.paging()
  if (request.query.project_id) {
    hql.where.project_id = request.query.project_id;
  }
  hql.order = { order: 1, updatedAt: -1 }
  const items = await models.Component.getList(hql);
  response.success({ items });
})

ComponentRoute.get('/:id', async ({ params, req, models, response }) => {
  const where = { _id: params.id };
  const item = await models.Component.getInfo({ where });
  response.success({ item });
})

ComponentRoute.post('/', async ({ state, request, response, models }) => {
  const data = request.body;
  data._id = v4();
  data.project_id = state.project_id
  const item = await models.Component.create(data);
  response.success({ item });
});

ComponentRoute.post('/batch', async ({ request, response, models }) => {
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
    await models.Component.bulkWrite(arr);
  }
  response.success();
});

ComponentRoute.put('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  const data = _.pick(request.body, ['name', 'desc', 'cover', 'icon', 'title', 'available', 'status', 'order', 'type', 'project_id', 'template_id', 'parent_id', 'attrs']);
  data.updatedAt = new Date();
  const item = await models.Component.update({ where, data });
  response.success(item);
});

ComponentRoute.delete('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  await models.Component.destroy({ where });
  response.success();
});

export default ComponentRoute