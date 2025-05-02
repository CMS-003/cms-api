import { getResourceInfo } from '#services/resource.js';
import { verifyToken } from '#services/user.js';
import Router from 'koa-router'
import _ from 'lodash'

const route = new Router();

route.get('/resource/:_id', async (ctx) => {
  let user_id = '';
  try {
    const user = await verifyToken(ctx.get('authorization') || '');
    user_id = user.id;
  } catch (e) {

  }
  const doc = await getResourceInfo(ctx.params._id, user_id, false);
  if (!doc) {
    return ctx.response.fail();
  }
  ctx.response.success(doc)
})

route.get('/:app/resources', async ({ request, query, params, models, response }) => {
  // @ts-ignore
  const qid = query.qid.split(',');

  const sql = request.paginate((hql) => {
    hql.sort = { updatedAt: -1 }
  })
  const queries = await models.MQuery.getAll({ where: { status: 2, _id: { $in: qid } }, attrs: { createdAt: 0, updatedAt: 0 }, lean: true })
  queries.forEach(q => {
    if (q.type === 'where') {
      Object.assign(sql.where, JSON.parse(q.value))
    } else if (q.type === 'sort') {
      sql.sort = JSON.parse(q.value)
    } else if (q.type === 'limit') {
      sql.limit = parseInt(q.value)
    }
  })
  let model = models.MResource;
  if (params.app === 'demo') {
    model = models.MResourceDemo;
  }
  const items = await model.getList(sql)
  response.success({ items })
})

export default route