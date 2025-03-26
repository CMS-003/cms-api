import Router from 'koa-router'
import _ from 'lodash'

const route = new Router();

route.get('/boot/:name', async ({ request, params, models, response }) => {
  const query = request.paginate((hql) => {

  })
  const where = { $or: [{ name: params.name }, { _id: params.name }] }

  response.success({})
})

export default route