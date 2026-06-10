import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  const where = { _id: params.id };
  const item = await models.MCapsule.getInfo({ where, lean: true });
  if (item) {
    response.success(item);
  } else {
    response.fail({ message: '未找到' })
  }
})

export default route;
