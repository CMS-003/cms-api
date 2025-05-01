import Router from 'koa-router'
import Scheduler from '#utils/scheduler.js';

const router = new Router({
  prefix: '',
});

router.get('/', async ({ models, scheduler, config, state, request, response }) => {
  const docs = await models.MSchedule.getAll({ lean: true });
  const results = docs.map(doc => {
    const task = Scheduler.tasks[doc._id];
    const v = { isActive: false, isRunning: false, ...doc };
    if (task) {
      v.isActive = Scheduler.isActive(doc._id);
      v.isRunning = Scheduler.isRunning(doc._id);
    }
    return v;
  })
  response.success({ items: results });
});

router.post('/', async ({ models, request, response }) => {
  const doc = await models.MSchedule.model.create(request.body);
  response.success(doc);
});

router.get('/:_id', async ({ models, request, params, response }) => {
  const item = await models.MSchedule.getInfo({ where: { _id: params._id }, lean: true });
  if (item) {
    response.success(item);
  } else {
    response.fail();
  }
});

router.put('/:_id', async (ctx) => {
  const { params, models, request, response } = ctx;
  const where = { _id: params._id };
  await models.MSchedule.update({ where, data: { $set: request.body } });
  const task = await models.MSchedule.getInfo({ where, lean: true });
  if (task) {
    Scheduler.load(task, ctx)
  }
  response.success();
});

router.del('/:id', async (ctx) => {
  const { models, params, response } = ctx;
  await models.MSchedule.destroy({ where: { _id: params.id } });
  Scheduler.remove(params.id)
  response.success();
})

router.post('/:_id/status', async ({ params, models, request, response }) => {
  const where = { _id: params._id };
  await models.MSchedule.update({ where, data: { $set: request.body } });
  if (request.body.status === 1) {
    Scheduler.stop(params._id);
  } else if (request.body.status === 2) {
    Scheduler.start(params._id);
  }
  response.success();
});

router.patch('/:_id', async (ctx) => {
  try {
    if (Scheduler.isActive(ctx.params._id)) {
      const ok = Scheduler.tick(ctx.params._id);
      return ok ? ctx.response.success() : ctx.response.fail({ message: '任务正在运行' })
    } else {
      return ctx.response.fail({ message: '任务不可运行' })
    }
  } catch (e) {
    ctx.response.fail(e);
  }
});


export default router