import Router from 'koa-router'
import shortid from 'shortid';

const router = new Router({
  prefix: '',
});
router.get('/', async ({ models, scheduler, config, state, request, response }) => {
  const hql = request.paginate(opt => {
    if (request.query.status) {
      opt.where.status = parseInt(request.query.status.toString(), 10)
    }
  });
  const results = await models.MInterface.getList(hql)
  response.success({ items: results });
});

router.post('/', async ({ models, request, response }) => {
  request.body._id = request.body._id || shortid.generate();
  request.body.createdAt = new Date();
  request.body.updatedAt = new Date();
  const doc = await models.MInterface.create(request.body);
  response.success(doc);
});

router.put('/:_id', async (ctx) => {
  const { params, models, request, response } = ctx;
  const where = { _id: params._id };
  request.body.updatedAt = new Date();
  await models.MInterface.update({ where, data: { $set: request.body } });
  const result = await models.MInterface.getInfo({ where, lean: true })
  response.success(result);
});

router.del('/:_id', async (ctx) => {
  const { params, models, response } = ctx;
  const where = { _id: params._id };
  await models.MInterface.destroy({ where });
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