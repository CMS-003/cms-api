import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  const where = { _id: query.id };
  const item = await models.MUser.getInfo({ where, lean: true });
  response.success(item);
})

route.put('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  request.body.updatedAt = new Date();
  await models.MUser.update({ where, data: { $set: request.body } });
  const item = await models.MUser.getInfo({ where, lean: true });
  response.success(item);
})

route.del('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  await models.MUser.destroy({ where });
  response.success();
})

export default route;
