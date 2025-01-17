import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'
import verify from '#middleware/verify.js'

const router = new Router();

router.get('/', verify, async ({ models, request, state, response }) => {
  const hql = request.paginate()
  if (request.query.type) {
    hql.where.type = request.query.type;
  }
  if (request.query.project_id) {
    hql.where.project_id = request.query.project_id
  }
  hql.sort = { order: 1 }
  const items = await models.MTemplate.getList(hql);
  response.success({ items })
})

router.post('/', verify, async ({ models, state, request, response }) => {
  request.body._id = v4()
  request.body.project_id = state.project_id
  await models.MTemplate.create(request.body)
  response.success()
})

router.put('/:template_id', verify, async ({ models, params, request, response }) => {
  await models.MTemplate.update({ where: { _id: params.template_id }, data: request.body })
  response.success()
})

router.get('/:template_id/fields', verify, async ({ models, params, request, response }) => {
  const hql = { where: { _id: params.template_id }, lean: true }
  const item = await models.MTemplate.getInfo(hql);
  response.success({ items: item ? (item.fields || []) : [] })
})

export default router