import Router from 'koa-router'
import _ from 'lodash'

const route = new Router();

route.get('/resource/:_id', async (ctx) => {
  const doc = await ctx.getResourceByCache(ctx.params._id, false);
  if (!doc) {
    return ctx.response.fail();
  }
  ctx.response.success(doc)
})

route.get('/resources', async ({ request, params, models, response }) => {
  const query = request.paginate((hql) => {

  })
  const docs = await models.MResource.getList({ where: {}, page: query.page, limit: query.limit })
  response.success(docs)
})

export default route