import Router from 'koa-router'
import _ from 'lodash'

const router = new Router();

router.get('/system', async ({ models, response, request }) => {
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

router.del('/system/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  await models.MLog.destroy({ where });
  response.success();
});

export default router