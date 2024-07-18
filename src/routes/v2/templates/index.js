import Router from 'koa-router'
import _ from 'lodash'
import componentService from '#services/component.js'

const router = new Router({
  prefix: '',
});

router.get('/:id/components', async ({ params, request, models, response }) => {
  const hql = request.paging();
  const template = await models.Template.getInfo({ where: { $or: [{ _id: params.id }, { name: params.id }] }, lean: true });
  if (!template) {
    return response.throwBiz('COMMON.NotFound')
  }
  hql.where = { template_id: template._id, parent_id: '' };
  hql.lean = true;
  hql.sort = { order: 1 }
  const items = await models.Component.getList(hql);
  for (let i = 0; i < items.length; i++) {
    const tree = await componentService.getTree(items[i]._id);
    if (tree) {
      items[i].children = tree.children;
    }
  }
  template.children = items;
  response.success(template);
})

export default router