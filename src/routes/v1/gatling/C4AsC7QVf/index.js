
import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  const hql = request.paginate();
  hql.sort = { createdAt: -1 };
  hql.lean = true;
  if (request.query.type) {
    hql.where = { type: request.query.type }
  }
  const total = await models.MLog.count(hql);
  const items = await models.MLog.getList(hql);
  response.success({ items, total });
})

export default route;
