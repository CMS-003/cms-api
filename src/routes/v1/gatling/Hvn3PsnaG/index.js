import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, query, request, response } = ctx;
  const hql = request.paginate(opt => {
    if (query.status) {
      opt.where.status = parseInt(query.status.toString(), 10)
    }
    if (query.q) {
      opt.where.$or = [{ name: { $regex: query.q } }, { nickname: { $regex: query.q } }];
    }
    if (query.sort) {
      const key = query.sort.replace('-', '');
      const d = query.sort[0] === '-' ? -1 : 1;
      if (key) {
        opt.sort = { [key]: d };
      }
    } else {
      opt.sort = { updatedAt: -1 };
    }
  });
  const total = await models.MUser.count(hql);
  const items = await models.MUser.getList(hql);
  response.success({ items, total });
})

export default route;
