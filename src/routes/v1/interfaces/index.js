import Router from 'koa-router'
import { VMScript, NodeVM } from 'vm2';
import constant from '#constant.js';

const router = new Router({
  prefix: '',
});
router.get('/', async ({ models, scheduler, config, state, request, response }) => {
  const hql = request.paging();
  hql.where.status = { status: { $not: 0 } }
  const results = models.MInterface.getList(hql)
  response.success({ items: results });
});

router.post('/', async ({ models, request, response }) => {
  const total = await models.MInterface.sum();
  request.body._id = (total + 100001).toString();
  const doc = await models.MInterface.create(request.body);
  response.success(doc);
});

router.put('/:_id', async (ctx) => {
  const { params, models, request, response } = ctx;
  const where = { _id: params._id };
  await models.MInterface.update({ where, data: { $set: request.body } });
  response.success();
});

router.del('/:_id', async (ctx) => {
  const { params, models, response } = ctx;
  const where = { _id: params._id };
  await models.MInterface.update({ where, data: { $set: { status: 0 } } });
  response.success();
});

router.get('/:_id', async (ctx) => {
  const { params, models, request, response } = ctx;
  const where = { _id: params._id };
  const api = await models.MInterface.getInfo({ where, lean: true });
  if (api) {
    const code = new VMScript(api.script).compile();
    const fn = new NodeVM({
      console: 'inherit',
      sandbox: {
        process: {
          env: process.env,
        }
      },
      require: {
        external: true,
        root: constant.PATH.ROOT,
        builtin: ['*'],
      }
    }).run(code, {});
    fn(ctx);
  } else {
    response.fail();
  }
});

export default router