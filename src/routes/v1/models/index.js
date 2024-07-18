import Router from 'koa-router'
import _ from 'lodash'

const router = new Router();

router.get('/', async ({ response, models }) => {
  const tables = [];
  Object.keys(models).forEach(table => {
    const fields = models[table].getAttributes();
    tables.push({ table, fields });
  });
  response.success(tables);
});

router.get('/:name', async ({ params, response, models }) => {
  const name = _.upperFirst(params.name)
  const fields = models[name].getAttributes();
  response.success(fields);
});

export default router