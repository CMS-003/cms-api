import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'
import verify from '#middleware/verify.js'
import { getRedis } from '#utils/redis.js';

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
  const items = await models.MTemplate.getAll(hql);
  response.success({ items })
})

router.post('/', verify, async ({ models, state, request, response }) => {
  request.body._id = v4()
  request.body.project_id = state.project_id
  request.body.createdAt = new Date();
  request.body.updatedAt = new Date();
  await models.MTemplate.create(request.body)
  response.success()
})

router.put('/:template_id', verify, async ({ models, params, request, response }) => {
  request.body.updatedAt = new Date();
  await models.MTemplate.update({ where: { _id: params.template_id }, data: { $set: request.body } })
  response.success()
})

router.del('/:template_id', verify, async ({ models, params, request, response }) => {
  const tree_ids = await models.MComponent.aggregate([
    { $match: { template_id: params.template_id } },
    { $group: { _id: "$tree_id" } }
  ]);
  await models.MComponent.destroy({ where: { template_id: params.template_id } })
  await models.MTemplate.destroy({ where: { _id: params.template_id } })
  const redis = getRedis();
  if (redis && tree_ids.length) {
    await redis.del(tree_ids.map(v => `api:v1:component_module:${v._id}:detail`))
  }
  response.success()
})

router.get('/:template_id/fields', verify, async ({ models, params, request, response }) => {
  const hql = { where: { _id: params.template_id }, lean: true }
  const item = await models.MTemplate.getInfo(hql);
  response.success({ items: item ? (item.fields || []) : [] })
})

export default router