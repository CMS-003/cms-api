import Router from 'koa-router'
import _ from 'lodash'

const router = new Router();

router.get('/:name', async ({ params, response, models }) => {
  const name = _.upperFirst(params.name)
  const fields = models[name].getAttributes();
  response.success(fields);
});

export default router