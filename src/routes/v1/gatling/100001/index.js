import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  if (query.id) {
    const item = await models.MSpider.getInfo({ where, lean: true });
    response.success(item);
  } else {
    const items = await models.MSpider.getAll({ lean: true });
    response.success({ items });
  }
})

route.put('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  request.body.updatedAt = new Date();
  if (request.body.urls) {
    request.body.urls.forEach(v => {
      if (v.enabled) {
        request.body.pattern = v.url;
      }
    });
  }
  await models.MSpider.update({ where, data: { $set: request.body } });
  const item = await models.MSpider.getInfo({ where, lean: true });
  response.success(item);
})

route.post('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  request.body.createdAt = new Date();
  request.body.updatedAt = new Date();
  let pattern = '';
  (request.body.urls || []).forEach(v => {
    if (v.enabled) {
      pattern = v.url;
    }
  });
  request.body.pattern = pattern;
  await models.MSpider.create(request.body);
  const item = await models.MSpider.getInfo({ where: { _id: request.body._id }, lean: true })
  response.success(item);

})

route.del('/', async (ctx) => {
  const { models, request, query, response } = ctx;
  await models.MSpider.destroy({ where });
  response.success();
})
export default route;
