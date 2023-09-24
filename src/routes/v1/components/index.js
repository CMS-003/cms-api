const Router = require('koa-router')
const _ = require('lodash');
const uuid = require('uuid');

const ComponentRoute = new Router({
  prefix: '',
});

ComponentRoute.get('/', async ({ BLL, state, request, response }) => {
  const hql = request.paging()
  if (request.query.project_id) {
    hql.where.project_id = request.query.project_id;
  }
  hql.order = { order: 1, updatedAt: -1 }
  const items = await BLL.componentBLL.getList(hql);
  response.success({ items });
})

ComponentRoute.get('/:id', async ({ params, req, BLL, response }) => {
  const where = { _id: params.id };
  const item = await BLL.componentBLL.getInfo({ where });
  response.success({ item });
})

ComponentRoute.post('/', async ({ state, request, response, BLL }) => {
  const data = request.body;
  data._id = uuid.v4();
  data.project_id = state.project_id
  const item = await BLL.componentBLL.create(data);
  response.success({ item });
});

ComponentRoute.post('/batch', async ({ request, response, BLL }) => {
  const info = request.body;
  const arr = info.map(({ _id, ...data }) => {
    data.updatedAt = new Date();
    return {
      updateOne: {
        filter: { _id },
        update: { $set: data, $setOnInsert: { createdAt: new Date() } },
        upsert: true,
      }
    }
  });
  if (arr.length) {
    await BLL.componentBLL.model.bulkWrite(arr);
  }
  response.success();
});

ComponentRoute.put('/:id', async ({ params, request, response, BLL }) => {
  const where = { _id: params.id };
  const data = _.pick(request.body, ['name', 'desc', 'cover', 'icon', 'title', 'available', 'status', 'order', 'type', 'project_id', 'template_id', 'parent_id', 'attrs']);
  data.updatedAt = new Date();
  const item = await BLL.componentBLL.update({ where, data });
  response.success(item);
});

ComponentRoute.delete('/:id', async ({ params, request, response, BLL }) => {
  const where = { _id: params.id };
  await BLL.componentBLL.destroy({ where });
  response.success();
});

module.exports = ComponentRoute