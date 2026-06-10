import Router from 'koa-router'

const route = new Router();

route.del('/', async (ctx) => {
  const { models, query, request, response, redis } = ctx;
  try {
    let Media = null;
    const type = query.type;
    if (type === 'video') {
      Media = models.MMediaVideo;
    } else if (type === 'image') {
      Media = models.MMediaImage;
    }
    if (!Media) {
      return response.fail();
    }
    const doc = await Media.getInfo({ where: { _id: query.id }, lean: true });
    if (!doc) {
      return response.fail();
    }
    await Media.model.deleteOne({ _id: query.id });
    await redis.del(`api:v1:resource:${doc.res_id}:detail`)
    response.success();
  } catch (e) {
    console.log(e);
    response.fail();
  }
})

export default route;
