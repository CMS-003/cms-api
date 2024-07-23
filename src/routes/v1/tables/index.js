import Router from 'koa-router'
import _ from 'lodash'
import { getTableViews } from '#services/table.js'

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

router.get('/:name/fields', async ({ params, response, models }) => {
  const name = _.upperFirst(params.name)
  const fields = models[name].getAttributes();
  response.success(fields);
});

router.get('/:name/views', async ({ params, response, models }) => {
  const result = { name: params.name, forms: [], lists: [] };
  const views = await getTableViews(params.name);
  result.forms = views.filter(view => view.type === 'form');
  result.lists = views.filter(view => view.type === 'list');
  response.success(result);
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