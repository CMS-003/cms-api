import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  const results = await models.MAccount.getAll({ lean: true });
  response.success(results);
})

export default route;
