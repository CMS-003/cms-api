import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'
import verify from '../../../middleware/verify.js'

const templateRoute = new Router();

templateRoute.get('/', verify, async ({ models, request, state, response }) => {
  const hql = request.paging()
  if (request.query.type) {
    hql.where.type = request.query.type;
  }
  if (request.query.project_id) {
    hql.where.project_id = request.query.project_id
  }
  hql.sort = { order: 1 }
  const items = await models.Template.getList(hql);
  response.success({ items })
})

templateRoute.post('/', verify, async ({ models, state, request, response }) => {
  request.body._id = v4()
  request.body.project_id = state.project_id
  await models.Template.create(request.body)
  response.success()
})

templateRoute.put('/:template_id', verify, async ({ models, params, request, response }) => {
  await models.Template.update({ where: { _id: params.template_id }, data: request.body })
  response.success()
})

templateRoute.get('/:template_id/fields', verify, async ({ models, params, request, response }) => {
  const hql = { where: { _id: params.template_id }, lean: true }
  const item = await models.Template.getInfo(hql);
  response.success({ items: item ? (item.fields || []) : [] })
})

export default templateRoute