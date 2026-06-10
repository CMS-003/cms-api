import _ from 'lodash'
import Router from 'koa-router'

const route = new Router();

route.put('/', async (ctx) => {
  const { models, request, response } = ctx;
  const _id = request.query.id;
  const data = _.pick(request.body, ['account', 'name', 'mark', 'email', 'phone', 'weight'])
  const results = await models.MAcount.getAll({ lean: true });
  response.success(results);
})

export default route;
