import Router from 'koa-router'
import _ from 'lodash'
import shortid from 'shortid';
import { v4 } from 'uuid';

const router = new Router();

router.get('/', async ({ response, models }) => {
  const tables = [];
  Object.keys(models).forEach(table => {
    const fields = models[table].getAttributes();
    const data = { table, fields };
    tables.push(data);
  });
  response.success(tables);
});

router.get('/views', async ({ response, models }) => {
  const tables = [];
  const names = Object.keys(models);
  const schemas = await models.JsonSchema.getAll({ lean: true });
  const map = _.keyBy(schemas, 'name');
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const table = { name, forms: [], lists: [], visible: 1, title: '' };
    const views = await models.View.getAll({ where: { table: name }, lean: true });
    table.forms = views.filter(view => view.type === 'form');
    table.lists = views.filter(view => view.type === 'list');
    if (map[name]) {
      table.title = map[name].title;
      if (_.isNumber(map[name].visible)) {
        table.visible = map[name].visible;
      }
    }
    tables.push(table);
  }
  response.success({ items: tables.filter(t => t.visible === 1) });
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

router.get('/:name/list', async ({ params, request, response, models }) => {
  const name = _.upperFirst(params.name);
  const hql = request.paging();
  hql.lean = true;
  if (models[name]) {
    const items = await models[name].getList(hql);
    response.success({ items });
  } else {
    response.fail();
  }
});

router.post('/:name/data', async ({ params, request, response, models }) => {
  const name = _.upperFirst(params.name);
  if (name === 'Interface') {
    const total = await models.Interface.sum();
    request.body._id = (total + 100001).toString();
  } else {
    request.body._id = v4();
  }
  request.body.createdAt = new Date();
  request.body.updatedAt = new Date();
  if (models[name]) {
    await models[name].create(request.body);
    response.success({ _id: request.body._id });
  } else {
    response.fail();
  }
});

router.put('/:name/data', async ({ params, request, response, models }) => {
  const name = _.upperFirst(params.name);
  request.body.updatedAt = new Date();
  const { _id, ...data } = request.body;
  if (_id && models[name]) {
    await models[name].update({ where: { _id }, data: { $set: data } });
    response.success();
  } else {
    response.fail();
  }
});

router.del('/:name/data/:_id', async ({ params, response, models }) => {
  const name = _.upperFirst(params.name);
  if (models[name]) {
    await models[name].destroy({ where: { _id: params._id } });
    response.success();
  } else {
    response.fail();
  }
});

router.get('/:name/views', async ({ params, response, models }) => {
  const result = { name: params.name, forms: [], lists: [] };
  const views = await models.View.getAll({ where: { table: params.name }, lean: true });
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