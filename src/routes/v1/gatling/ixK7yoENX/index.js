import _ from 'lodash'
import Router from 'koa-router'
import dayjs from '#utils/dayjs.js'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  const dayjs = (await import('dayjs')).default;
  const hql = request.paginate();
  hql.sort = { createdAt: -1 };
  hql.lean = true;
  hql.where = _.pick(request.query, ['receiver', 'name']);
  if (request.query.date && typeof request.query.date === 'string') {
    const start = dayjs(request.query.date).startOf('day').toDate();
    const end = dayjs(start).endOf('day').toDate();
    hql.where.createdAt = { $gt: start, $lt: end };
  }
  const items = await models.MCapsule.getList(hql);
  response.success({ items });
})

export default route;
