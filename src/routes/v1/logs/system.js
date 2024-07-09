import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'


const route = new Router();

route.get('/system', async ({ models, response, request }) => {
  const hql = request.paging();
  hql.sort = { createdAt: -1 };
  hql.lean = true;
  if (request.query.type) {
    hql.where = { type: request.query.type }
  }
  const items = await models.Log.getList(hql);
  response.success({ items });
})

route.del('/system/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  await models.Log.destroy({ where });
  response.success();
});

export default route