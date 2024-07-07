import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'


const ConfigRoute = new Router();

ConfigRoute.get('/', async ({ models, response, request }) => {
  const hql = request.paging();
  hql.sort = { type: 1 };
  hql.lean = true;
  if (request.query.type) {
    hql.where = { type: request.query.type }
  }
  const items = await models.Config.getAll(hql);
  response.success({ items });
})

ConfigRoute.get('/:id', async ({ params, models, response }) => {
  const where = { _id: params.id };
  const item = await models.Config.getInfo({ where });
  response.success({ item });
})

ConfigRoute.post('/', async ({ request, response, models }) => {
  const data = _.pick(request.body, ['_id', 'project_id', 'name', 'desc', 'type', 'value', 'order']);
  if (_.isNil(data.project_id)) {
    return response.throwBiz('COMMON.NeedParam', { param: 'project_id' })
  }
  const item = await models.Config.create(data);
  response.success({ item });
});

ConfigRoute.put('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  const data = _.pick(request.body, ['project_id', 'name', 'desc', 'type', 'value', 'order']);
  if (_.isNil(data.project_id)) {
    return response.throwBiz('COMMON.NeedParam', { param: 'project_id' })
  }
  await models.Config.update({ where, data });
  response.success();
});

ConfigRoute.del('/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  await models.Config.destroy({ where });
  response.success();
});

export default ConfigRoute