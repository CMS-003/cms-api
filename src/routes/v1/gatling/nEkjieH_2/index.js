import Router from 'koa-router'
import suid from '#utils/suid.js'

const route = new Router();

route.post('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  request.body._id = suid();
  request.body.createdAt = new Date();
  request.body.updatedAt = new Date();
  await models.MQuery.create(request.body);
  const item = await models.MQuery.getInfo({ where: { _id: request.body._id }, lean: true })
  response.success(item);
})

route.get('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  const where = { _id: query.id };
  const item = await models.MQuery.getInfo({ where, lean: true });
  response.success(item);
})

route.put('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  const where = { _id: query.id };
  request.body.updatedAt = new Date();
  await models.MQuery.update({ where, data: { $set: request.body } });
  const item = await models.MQuery.getInfo({ where, lean: true });
  response.success(item);
})

route.del('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  const where = { _id: query.id };
  await models.MQuery.destroy({ where });
  response.success();
})

export default route;
