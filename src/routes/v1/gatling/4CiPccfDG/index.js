import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  const hql = request.paginate(opt => {
    if (request.query.status) {
      opt.where.status = parseInt(request.query.status.toString(), 10)
    }
    if (request.query.q) {
      opt.where.title = { $regex: request.query.q }
    }
  });
  const total = await models.MQuery.count(hql);
  const items = await models.MQuery.getList(hql);
  response.success({ items, total });
})

export default route;
