const Router = require('koa-router')

const schedule = new Router({
  prefix: '',
});

schedule.get('/', async ({ app, response }) => {
  const items = Object.keys(app.schedule.tasks).map(name => ({ id: name, name, started: false }));
  Object.keys(app.schedule.jobs).forEach(name => {
    const item = items.find(task => task.name === name)
    if (item) {
      item.started = true;
    }
  })
  response.success({ items, ended: true });
});

schedule.get('/:name/data', async ({ params, app, request, response }) => {
  const { pneumoniaBLL } = app.BLL;
  const { page, limit } = request.paging();
  if (params.name === 'pneumonia') {
    const items = await pneumoniaBLL.getList({ page, limit, order: { createdAt: -1 }, lean: true })
    response.success({ items: items.reverse().map(item => ({ date: item.data.upate_time.split(' ')[0], country: item.data.country, world: item.data.world })) });
  }
});

schedule.patch('/:name', async ({ params, app, response }) => {
  await app.schedule.tick(params.name);
  response.success();
});

schedule.post('/:name/operate/:operate', async ({ response, app, params }) => {
  if (params.operate === 'start') {
    app.schedule.start(params.name);
  } else if (params.operate === 'stop') {
    app.schedule.stop(params.name);
  }
  response.success();
})

module.exports = schedule