import { initTable } from '#mongodb.js';
import Router from 'koa-router'
import _ from 'lodash'
import { v4, v7 } from 'uuid';

const router = new Router();

router.get('/', async ({ response, models }) => {
  const items = await models.MJsonSchema.getAll({ sort: { createdAt: 1 }, lean: true });
  response.success({ items });
});

router.get('/:name', async ({ params, response, models }) => {
  const doc = await models.MJsonSchema.getInfo({ where: params, lean: true });
  if (doc) {
    response.success(doc.schema);
  } else {
    response.fail({ message: 'NotFound' });
  }
});

router.put('/:name', async ({ params, request, response, dbs, models }) => {
  await models.MJsonSchema.update({ where: params, data: { $set: request.body } });
  const doc = await models.MJsonSchema.getInfo({ where: params, lean: true });
  if (doc && doc.status === 1 && dbs[doc.db]) {
    if (doc.status === 1) {
      await initTable(dbs[doc.db], doc);
    } else {
      delete models[doc.name]
      dbs[doc.db].deleteModel(doc.name)
    }
  }
  response.success();
});

router.post('/:name', async ({ params, request, response, dbs, models }) => {
  if (!request.body.table || !request.body.db) {
    return response.fail({ message: '参数错误' });
  }
  request.body._id = v7();
  request.body.name = params.name;
  await models.MJsonSchema.create(request.body);
  const doc = await models.MJsonSchema.getInfo({ where: params, lean: true });
  response.success(doc);
});

router.get('/:name/fields', async ({ params, response, models }) => {
  const name = params.name
  const fields = models[name].getAttributes();
  response.success(fields);
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