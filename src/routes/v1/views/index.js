import Router from 'koa-router'
import _ from 'lodash'

const router = new Router();

router.get('/:_id', async ({ query, params, response, models }) => {
  const result = await models.View.getInfo({ where: { _id: params._id }, lean: true });
  if (result && query.id) {
    const table = _.upperFirst(result.table);
    if (models[table]) {
      result.data = await models[table].getInfo({ where: { _id: query.id }, lean: true });
    }
  }
  response.success(result);
});

export default router