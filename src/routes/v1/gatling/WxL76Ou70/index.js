import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, query, request, response } = ctx;
  const hql = request.paginate(opt => {
    if (query.status) {
      opt.where.status = parseInt(query.status.toString(), 10)
    }
    if (query.type) {
      opt.where.type = query.type;
    }
    if (query.q) {
      opt.where.$or = [{ _id: query.q }, { title: { $regex: query.q } }];
    }
    opt.sort = { createdAt: -1 };
  });
  const total = await models.MResource.count(hql);
  const items = await models.MResource.getList(hql);
  response.success({ items, total });
})

export default route;
