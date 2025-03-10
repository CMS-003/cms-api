import Router from 'koa-router'

const router = new Router({
  prefix: '',
});
router.get('/', async ({ models, scheduler, config, state, request, response }) => {
  const hql = request.paginate(opt => {
    if (request.query.status) {
      opt.where.status = parseInt(request.query.status.toString(), 10)
    } else {
      opt.where.status = { $ne: 0 }
    }
  });
  const results = await models.MInterface.getList(hql)
  response.success({ items: results });
});

router.post('/', async ({ models, request, response }) => {
  const total = await models.MInterface.count();
  request.body._id = (total + 100001).toString();
  const doc = await models.MInterface.create(request.body);
  response.success(doc);
});

router.put('/:_id', async (ctx) => {
  const { params, models, request, response } = ctx;
  const where = { _id: params._id };
  await models.MInterface.update({ where, data: { $set: request.body } });
  const result = await models.MInterface.getInfo({ where, lean: true })
  response.success(result);
});

router.del('/:_id', async (ctx) => {
  const { params, models, response } = ctx;
  const where = { _id: params._id };
  await models.MInterface.update({ where, data: { $set: { status: 0 } } });
  response.success();
});

router.get('/:_id', async (ctx) => {
  const where = { _id: ctx.params._id };
  const doc = await ctx.models['MInterface'].getInfo({ where, lean: true });
  if (doc) {
    ctx.response.success(doc)
  } else {
    ctx.response.throwBiz('NotFound')
  }
});

export default router