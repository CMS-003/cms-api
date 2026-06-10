import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  const hql = request.paginate(opt => {
    if (request.query.status) {
      opt.where.status = parseInt(request.query.status.toString(), 10)
    }
    opt.sort = { createdAt: -1 };
  });
  const total = await models.MMediaVideo.count(hql);
  const items = await models.MMediaImage.getList(hql);
  response.success({ items, total });
})

export default route;
