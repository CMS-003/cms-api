import Router from 'koa-router'
import fs from 'fs'
import path from 'path'
import { v7 } from 'uuid'
import crypto from 'crypto'
import constant from '#constant.js'

const route = new Router();

route.post('/', async (ctx) => {
  const { models, request, query, response, redis } = ctx;
  const type = query.type;

  let Media = null;
  let ext = '';
  if (type === 'video') {
    Media = models.MMediaVideo;
    ext = 'mp4';
  } else if (type === 'image') {
    Media = models.MMediaImage;
    ext = 'jpg';
  } else if (type === 'caption') {
    ext = 'vtt';
  }
  if (!Media) {
    return response.fail();
  }

  const data = request.body;
  data.res_id = query.res_id || '';
  data.createdAt = new Date();
  data.more = {};
  if (data.res_id && data.url) {
    data._id = crypto.createHash('md5').update(`${data.url}-${data.res_id}`).digest('hex').toString();
  } else {
    data._id = v7();
  }
  if (!data.path) {
    data.path = `/proxy/${type}s/${data.res_id}/${data._id}.${ext}`;
  }
  fs.mkdirSync(path.dirname(constant.PATH.STATIC + data.path), { recursive: true })
  await redis.del(`api:v1:resource:${data.res_id}:detail`);
  await Media.create(data);
  response.success(data);
})

export default route;
