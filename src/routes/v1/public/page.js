import Router from 'koa-router'
import _ from 'lodash'
import { getComponentTreeInfo, collectionResourceID, fillResources } from '#services/component.js'

const route = new Router();

route.get('/page/:name', async ({ request, params, models, response }) => {
  const where = { $or: [{ name: params.name }, { _id: params.name }] }
  const page = await models.MTemplate.getInfo({ where, lean: true });
  if (!page) {
    return response.fail();
  }
  page.children = [];
  const components = await models.MComponent.getAll({ where: { template_id: page._id, parent_id: '' }, sort: { order: 1 }, lean: true })
  for (let i = 0; i < components.length; i++) {
    const tree = await getComponentTreeInfo(components[i].tree_id);
    if (tree) {
      page.children.push(tree)
    }
  }
  const ids = collectionResourceID(page);
  const resources = await models.MResource.model.find({ _id: { $in: ids } }).lean(true);
  fillResources(page, _.keyBy(resources, '_id'));
  response.success(page)
})

route.get('/page/:name/components', async ({ request, params, models, response }) => {
  const query = request.paginate((hql) => {
    hql.sort = { order: 1 };
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
  const components = await models.MComponent.getList({ where: { template_id: page._id, parent_id: '' }, page: query.page, limit: query.limit })
  for (let i = 0; i < components.length; i++) {
    const tree = await getComponentTreeInfo(components[i].tree_id);
    if (tree) {
      data.items.push(tree)
    }
  }
  response.success(data)
})

export default route