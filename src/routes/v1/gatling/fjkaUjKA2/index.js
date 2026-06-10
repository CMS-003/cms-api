import _ from 'lodash'
import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  const hql = request.paginate();
  hql.sort = { createdAt: -1 };
  hql.lean = true;
  if (hql.where.type) {
    hql.where.type = _.isArray(request.query.type) ? request.query.type.map(t => parseInt(t)) : parseInt(request.query.type);
  }
  if (request.query.user_id) {
    hql.where = { user_id: request.query.user_id }
  }
  const total = await models.MVerification.count(hql);
  const items = await models.MVerification.getList(hql);
  response.success({ items, total });
})

export default route;
