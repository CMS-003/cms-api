import { getResourceInfo } from '#services/resource.js';
import { verifyToken } from '#services/user.js';
import Router from 'koa-router'
import _ from 'lodash'
import CONST from 'const'

const route = new Router();

route.get('/resource/:_id', async (ctx) => {
  let user_id = '';
  try {
    const user = await verifyToken(ctx.get('authorization') || '');
    user_id = user.id;
  } catch (e) {

  }
  const doc = await getResourceInfo(ctx.params._id, user_id, true);
  if (!doc) {
    return ctx.response.fail();
  }
  ctx.response.success(doc)
})

route.put('/resource/:_id', async (ctx) => {
  const _id = ctx.params._id
  const data = ctx.request.body;
  const info = await ctx.models.MResource.getInfo({ where: { _id }, lean: true })
  if (data.status === CONST.STATUS.SUCCESS && info.type !== 'novel' && info.type !== 'article') {
    const videos = await ctx.models.MMediaVideo.getAll({ where: { res_id: _id, status: CONST.STATUS.SUCCESS }, lean: true });
    let size = 0;
    videos.forEach(v => {
      // @ts-ignore
      const duration = v.more.duration;
      size += typeof duration === 'number' ? duration : parseFloat(duration) || 0;
    });
    data.size = size;
  }
  await ctx.models.MResource.update({ where: { _id }, data: { $set: data } })
  await ctx.redis.del(`api:v1:resource:${_id}:detail`)
  await getResourceInfo(_id, '', false)
  ctx.response.success();
})

route.get('/resource/:id/origin', async (ctx) => {
  const doc = await ctx.models.MRecord.getInfo({ where: { _id: ctx.params.id }, lean: true })
  if (!doc) {
    return ctx.response.fail();
  }
  ctx.response.body = (`
    <meta http-equiv="refresh" content="0; url=${doc.origin}">
  `);
})

route.get('/:app/resources', async ({ request, query, params, models, response }) => {
  // @ts-ignore
  const qid = query.qid ? query.qid.split(',') : [];

  const sql = request.paginate((hql) => {
    hql.sort = { updatedAt: -1 }
    if (query.search) {
      hql.where.title = { $regex: query.search };
    }
    if (query.uid) {
      hql.where.uid = query.uid
    }
  })
  const queries = qid.length ? await models.MQuery.getAll({ where: { status: 2, _id: { $in: qid } }, attrs: { createdAt: 0, updatedAt: 0 }, lean: true }) : [];
  queries.forEach(q => {
    if (q.type === 'where') {
      const where = JSON.parse(q.value);
      if (Object.keys(where).length === 1 && where.tags) {
        if (!sql.where.tags) {
          sql.where.tags = { $in: [] }
        }
        if (_.isArray(where.tags)) {
          sql.where.tags.$in.push(...where.tags)
        } else {
          sql.where.tags.$in.push(where.tags);
        }
      } else {
        Object.assign(sql.where, where)
      }
    } else if (q.type === 'sort') {
      sql.sort = JSON.parse(q.value)
    } else if (q.type === 'limit') {
      sql.limit = parseInt(q.value)
    }
  })
  let model = models.MResource;
  if (params.app === 'demo') {
    // @ts-ignore
    model = models.MResourceDemo;
  }
  const items = await model.getList(sql)
  for (let i = 0; i < items.length; i++) {
    if (items[i].type === 'post') continue;
    if (items[i].type === 'article') {
      items[i].content = '';
      continue;
    }
    const result = await getResourceInfo(items[i]._id, '', false);
    items[i] = result;
  }
  response.success({ items })
})

export default route