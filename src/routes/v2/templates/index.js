const Router = require('koa-router')
const _ = require('lodash');
const uuid = require('uuid');
const componentService = require('../../../services/component.js')

const TemplateComponentsRoute = new Router({
    prefix: '',
});

TemplateComponentsRoute.get('/:id/components', async ({ params, request, BLL, response }) => {
    const hql = request.paging();
    const template = await BLL.templateBLL.getInfo({ where: { $or: [{ _id: params.id }, { name: params.id }] }, lean: true });
    if (!template) {
        return response.throwBiz('COMMON.NotFound')
    }
    hql.where = { template_id: template._id, parent_id: '' };
    hql.lean = true;
    hql.order = { order: 1 }
    const items = await BLL.componentBLL.getList(hql);
    for (let i = 0; i < items.length; i++) {
        const tree = await componentService.getTree(items[i]._id);
        if (tree) {
            items[i].children = tree.children;
        }
    }
    template.children = items;
    response.success(template);
})

module.exports = TemplateComponentsRoute