import Router from 'koa-router'
import _ from 'lodash'
import { getTableViews } from '#services/table.js'
import shortid from 'shortid';

const router = new Router();

router.get('/', async ({ response, models }) => {
  const tables = [];
  Object.keys(models).forEach(table => {
    const fields = models[table].getAttributes();
    tables.push({ table, fields });
  });
  response.success(tables);
});

router.get('/views', async ({ response, models }) => {
  const tables = [];
  const names = Object.keys(models);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const table = { name, forms: [], lists: [] };
    const views = await getTableViews(name);
    table.forms = views.filter(view => view.type === 'form');
    table.lists = views.filter(view => view.type === 'list');
    tables.push(table);
  }
  response.success({ items: tables });
});

router.post('/views', async ({ request, models, response }) => {
  const data = request.body;
  data._id = shortid.generate();
  data.order = 1;
  const result = await models.View.create(request.body);
  response.success(result);
})

router.get('/:name/fields', async ({ params, response, models }) => {
  const name = _.upperFirst(params.name)
  const fields = models[name].getAttributes();
  response.success(fields);
});

router.get('/:name/list', async ({ params, response, models }) => {
  const name = _.upperFirst(params.name);
  if (models[name]) {
    const items = await models[name].getList({ where: {}, lean: true });
    response.success({ items });
  } else {
    response.fail();
  }
});

router.get('/:name/views', async ({ params, response, models }) => {
  const result = { name: params.name, forms: [], lists: [] };
  const views = await getTableViews(params.name);
  result.forms = views.filter(view => view.type === 'form');
  result.lists = views.filter(view => view.type === 'list');
  response.success(result);
});

router.get('/:table/views/:_id', async ({ params, response, models }) => {
  const doc = await models.View.getInfo({ where: params, lean: true });
  if (doc) {
    response.success(doc);
  } else {
    response.fail();
  }
});

router.put('/:table/views/:_id', async ({ params, request, response, models }) => {
  await models.View.update({ where: params, data: request.body });
  response.success();
});


router.get('/:name/json-schema', async ({ params, models, response }) => {
  const model = models[_.upperFirst(params.name)];
  if (model) {
    const json = model.getJsonSchema();
    response.success(json);
  } else {
    response.fail();
  }
})

export default router