import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, query, request, response } = ctx;
  const hql = request.paginate(opt => {
    if (query.status) {
      opt.where.status = parseInt(query.status.toString(), 10)
    }
    if (query._id) {
      opt.where._id = query._id;
    }
    if (query.res_id) {
      opt.where.res_id = query.res_id;
    }
    opt.sort = { createdAt: -1 };
  });
  const total = await models.MMediaVideo.count(hql);
  const items = await models.MMediaVideo.getList(hql);
  response.success({ items, total });
})

export default route;
