import Router from 'koa-router'
import _ from 'lodash'

const route = new Router();

route.get('/resource/:_id', async ({ request, params, models, response }) => {
  const where = { _id: params._id }
  const doc = await models.MResource.getInfo({ where, lean: true });
  if (!doc) {
    return response.fail();
  }
  response.success(doc)
})

route.get('/resources', async ({ request, params, models, response }) => {
  const query = request.paginate((hql) => {

  })
  const docs = await models.MResource.getList({ where: {}, page: query.page, limit: query.limit })
  response.success(docs)
})

export default route