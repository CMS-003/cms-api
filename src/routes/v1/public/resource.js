import { getResourceInfo } from '#services/resource.js';
import Router from 'koa-router'
import _ from 'lodash'

const route = new Router();

route.get('/resource/:_id', async (ctx) => {
  const doc = await getResourceInfo(ctx.params._id, false);
  if (!doc) {
    return ctx.response.fail();
  }
  ctx.response.success(doc)
})

route.get('/resources', async ({ request, query, params, models, response }) => {
  // @ts-ignore
  const qid = query.qid.split(',');
  const q = request.paginate((hql) => {
    hql.sort = { updatedAt: -1 }
  })
  const queries = await models.MComponent.getAll({ where: { _id: { $in: qid } }, attrs: { query: 1 }, lean: true });
  queries.forEach(v => {
    if (v.query && !_.isEmpty(v.query.where)) {
      _.assign(q.where, v.query.where)
    }
  });
  const items = await models.MResource.getList(q)
  response.success({ items })
})

export default route