
import Router from 'koa-router'
import { verifyToken } from '#services/user.js';
import { getResourceInfo } from '#services/resource.js';

const route = new Router();

route.get('/', async (ctx) => {
  const { models, query, request, response } = ctx;
  const hql = request.paginate(opt => {
    opt.sort = { createdAt: -1 };
    if (query.type) {
      opt.where.type = parseInt(query.type);
    }
    return opt;
  });
  const user = await verifyToken(ctx.get('authorization'));
  hql.where.uid = user.id;
  const total = await models.MStar.count(hql);
  const docs = await models.MStar.getList(hql);
  const items = [];
  for (let i = 0; i < docs.length; i++) {
    const item = await getResourceInfo({ res_id: docs[i].rid }, user.id);
    items.push(item);
  }
  response.success({ total, items });
})


export default route;
