import Router from 'koa-router'

const route = new Router();

route.del('/', async (ctx) => {
  const { models, request, response } = ctx;
  await models.MAccount.update({ where: { _id: request.query.id }, data: { $set: { deletedAt: new Date(), status: 0 } } });
  response.success();
})

export default route;
