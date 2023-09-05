const Router = require('koa-router')
const _ = require('lodash');
const uuid = require('uuid');
const shortid = require('shortid')
const userVerify = require('../../../middleware/user_verify.js')

const templateRoute = new Router();

templateRoute.get('/', userVerify, async ({ BLL, request, state, response }) => {
  const hql = request.paging()
  console.log(state);
  const items = await BLL.templateBLL.getList(hql);
  response.success({ items })
})

templateRoute.post('/', userVerify, async ({ request, response }) => {
  await BLL.templateBLL.create(request.body)
  response.success()
})

templateRoute.put('/:template_id', userVerify, async ({ params, request, response }) => {
  await BLL.templateBLL.update({ where: { _id: params.template_id }, data: request.body })
  response.success()
})

module.exports = templateRoute