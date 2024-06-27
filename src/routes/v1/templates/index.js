const Router = require('koa-router')
const _ = require('lodash');
const uuid = require('uuid');
const shortid = require('shortid')
const userVerify = require('../../../middleware/user_verify.js')

const templateRoute = new Router();

templateRoute.get('/', userVerify, async ({ BLL, request, state, response }) => {
  const hql = request.paging()
  if (request.query.type) {
    hql.where.type = request.query.type;
  }
  if (request.query.project_id) {
    hql.where.project_id = request.query.project_id
  }
  hql.order = { order: 1 }
  const items = await BLL.templateBLL.getList(hql);
  response.success({ items })
})

templateRoute.post('/', userVerify, async ({ BLL, state, request, response }) => {
  request.body._id = uuid.v4()
  request.body.project_id = state.project_id
  await BLL.templateBLL.create(request.body)
  response.success()
})

templateRoute.put('/:template_id', userVerify, async ({ BLL, params, request, response }) => {
  await BLL.templateBLL.update({ where: { _id: params.template_id }, data: request.body })
  response.success()
})

templateRoute.get('/:template_id/fields', userVerify, async ({ BLL, params, request, response }) => {
  const hql = { where: { _id: params.template_id }, lean: true }
  const item = await BLL.templateBLL.getInfo(hql);
  response.success({ items: item ? (item.fields || []) : [] })
})

module.exports = templateRoute