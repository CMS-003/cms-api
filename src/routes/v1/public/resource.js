import { getResourceInfo } from '#services/resource.js';
import { verifyToken } from '#services/user.js';
import { getES, getQuery } from '#utils/es.js';
import Router from 'koa-router'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import CONST from 'const'
import crypto from 'crypto'
import { v7 } from 'uuid';

const route = new Router();

route.get('/resources', async ({ models, request, query, response }) => {
  const client = getES();
  if (!client) {
    return response.fail()
  }
  const hql = request.paginate(hql => {
    hql.where = _.pick(query, ['tags', 'sort']);
    const { key, value } = query;
    if (key && value) {
      switch (key) {
        case 'id': hql.where['_id'] = value; break;
        case 'q':
          hql.where.q = value;
          break;
      }
    }
    if (!query.sort) {
      hql.sort = { createdAt: -1 }
    }
    if (query.type) {
      hql.where.type = parseInt(query.type.toString());
    }
    if (query.q) {
      hql.where.q = query.q;
    }
    if (query.id) {
      hql.where.id = query.id;
    }
    if (query.region) {
      hql.where.region = query.region;
    }
    if (query.status) {
      hql.where.status = parseInt(query.status.toString());
    }
    return hql;
  })
  let ids = [];
  let total = 0;
  if (_.isEmpty(hql.where)) {
    total = await models.MResource.count(hql);
    ids = (await models.MResource.getList(hql)).map(v => v._id);
  } else {
    const sql = getQuery(hql)
    const result = await client.search(sql);
    // @ts-ignore
    total = result.hits.total.value;
    ids = result.hits.hits.map(hit => hit._id)
  }
  const items = [];
  for (let i = 0; i < ids.length; i++) {
    const item = await getResourceInfo(ids[i], '', false);
    items.push(item);
  }
  response.success({ total, items })
})

route.get('/resource/:_id', async (ctx) => {
  let user_id = '';
  try {
    const user = await verifyToken(ctx.get('authorization') || '');
    user_id = user.id;
  } catch (e) {

  }
  const doc = await getResourceInfo(ctx.params._id, user_id, true, true);
  if (!doc) {
    return ctx.response.fail();
  }
  ctx.response.success(doc)
})

route.post('/resource', async ({ models, request, response }) => {
  const { url, sid, source_id, ...resource } = request.body;
  const _id = sid && source_id ? crypto.createHash('md5').update(`${sid}|${source_id}`).digest('hex') : v7();
  if (!resource.createdAt) {
    resource.createdAt = new Date();
  }
  if (!resource.updatedAt) {
    resource.updatedAt = new Date();
  }
  await models.MRecord.create({ _id, source_id, spider_id: sid, origin: url, original: resource });
  await models.MResource.create({ ...resource, _id });
  response.success();
})

route.put('/resource/:_id', async (ctx) => {
  const _id = ctx.params._id
  const data = ctx.request.body;
  const info = await ctx.models.MResource.getInfo({ where: { _id }, lean: true })
  if (data.status === CONST.STATUS.SUCCESS && info.type !== 6 && info.type !== 1) {
    const videos = await ctx.models.MMediaVideo.getAll({ where: { res_id: _id, status: CONST.STATUS.SUCCESS }, lean: true });
    let size = 0;
    videos.forEach(v => {
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

function destroyFile(filepath) {
  if (typeof filepath === 'string') {
    const fullpath = path.join('/cms/static', filepath);
    try {
      fs.unlinkSync(fullpath);
    } catch (e) {

    }
  }
}
route.del('/resource/:_id', async ({ models, request, redis, params, response }) => {
  const { MResource, MRecord, MMediaChapter, MMediaImage, MMediaVideo, } = models;
  const doc = await getResourceInfo(params._id, '', true, false);
  if (!doc) {
    return response.fail();
  }
  destroyFile(doc.thumbnail);
  destroyFile(doc.post);
  destroyFile(doc.post);
  await MRecord.model.deleteOne({ _id: doc._id })
  await MResource.model.deleteOne({ _id: doc._id })
  for (let i = 0; i < doc.images.length; i++) {
    const detail = doc.images[i];
    destroyFile(detail.path);
    await MMediaImage.model.deleteOne({ _id: detail._id })
  }
  for (let i = 0; i < doc.videos.length; i++) {
    const detail = doc.videos[i];
    destroyFile(detail.path);
    await MMediaVideo.model.deleteOne({ _id: detail._id })
  }
  fs.existsSync(path.join('/cms/static', 'proxy/images', doc._id)) && fs.readdirSync(path.join('/cms/static', '/proxy/images', doc._id)).forEach(filename => {
    destroyFile(path.join('/proxy/images', doc._id, filename))
  });
  fs.existsSync(path.join('/cms/static', 'proxy/videos', doc._id)) && fs.readdirSync(path.join('/cms/static', '/proxy/videos', doc._id)).forEach(filename => {
    destroyFile(path.join('/proxy/videos', doc._id, filename))
  });
  await redis.del(`api:v3:resource:${doc._id}:detail`)
  response.success();
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
  const qid = query.qid ? query.qid.toString().split(',') : [];

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
  sql.aggregate = [];
  queries.forEach(q => {
    if (q.type === 'where') {
      const where = JSON.parse(q.value);
      if (where.tags) {
        if (!sql.where.tags) {
          sql.where.tags = { $in: where.tags }
        } else {
          sql.where.tags.$in.push(...where.tags)
        }
      } else {
        Object.assign(sql.where, where)
      }
    } else if (q.type === 'sort') {
      sql.sort = JSON.parse(q.value)
    } else if (q.type === 'limit') {
      sql.limit = parseInt(q.value)
    } else if (q.type === 'aggregate') {
      // @ts-ignore
      sql.aggregate.push(JSON.parse(q.value))
    }
  })
  let model = models.MResource;
  if (params.app === 'demo') {
    model = models.MResourceDemo;
  }
  const items = await model.getList(sql)
  for (let i = 0; i < items.length; i++) {
    if (items[i].type === CONST.RESOURCE.ARTICLE) {
      items[i].content = '';
      continue;
    }
    const result = await getResourceInfo(items[i]._id, '', false);
    items[i] = result;
  }
  response.success({ items })
})

export default route