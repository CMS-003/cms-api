const Router = require('koa-router')
const _ = require('lodash');
const uuid = require('uuid');

const TemplateComponentsRoute = new Router({
    prefix: '',
});

TemplateComponentsRoute.get('/:id/components', async ({ params, request, BLL, response }) => {
    const hql = request.paging();
    hql.where = { template_id: params.id };
    hql.order = { order: 1 }
    const item = await BLL.componentBLL.getInfo({ where });
    response.success({ item });
})

module.exports = TemplateComponentsRoute