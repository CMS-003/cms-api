import Router from 'koa-router'
import _ from 'lodash'
import utils from '#services/component.js'

const route = new Router();

route.get('/page/:name/components', async ({ request, params, models, response }) => {
  const query = request.paginate((hql) => {

  })
  const where = { $or: [{ name: params.name }, { _id: params.name }] }
  const page = await models.MTemplate.getInfo({ where, lean: true });
  if (!page) {
    return response.fail();
  }
  const data = {
    items: []
  }
  if (query.page === 1) {
    data.item = page;
  }
  const components = await models.MComponent.getList({ where: { template_id: page._id, parent_id: '' }, page: query.page, limit: 6 })
  for (let i = 0; i < components.length; i++) {
    const tree = await utils.getTree(models.MComponent, components[i].tree_id);
    if (tree) {
      data.items.push(tree)
    }
  }
  response.success(data)
})

export default route