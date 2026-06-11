import Router from 'koa-router'
import got from 'got'
import CONST from 'define'

const route = new Router();

route.put('/', async (ctx) => {
  const { models, query, request, response, redis } = ctx;
  const data = request.body;

  let Media = null;
  const type = query.type;
  if (type === 'video') {
    Media = models.MMediaVideo;
  } else if (type === 'image') {
    Media = models.MMediaImage;
  } else if (type === 'caption') {
    Media = models.MMediaCaption;
  }
  if (!Media) {
    return response.fail();
  }
  const doc = await Media.getInfo({ where: { _id: query.id }, lean: true });
  if (!doc) {
    return response.fail();
  }
  if (type === 'video' && data.status === CONST.STATUS.SUCCESS) {
    const resp = await got.post(`http://192.168.0.124/gw/download/ffmpeg/videoinfo`, {
      json: {
        filepath: doc.path
      },
      responseType: 'json'
    });
    if (resp.statusCode === 200 && resp.body.code === 0) {
      data.more = resp.body.data;
    }
  }
  await Media.update({ where: { _id: query.id }, data: { $set: data } });
  const children = await Media.getAll({ where: { res_id: doc.res_id }, attrs: { status: 1, more: 1 }, lean: true });
  const unFinished = children.find(child => child.status !== CONST.STATUS.SUCCESS);
  if (!unFinished) {
    const diff = { status: CONST.STATUS.SUCCESS };
    if (type === 'video') {
      let size = 0;
      children.forEach(v => {
        // @ts-ignore
        const duration = v.more ? v.more.duration : 0;
        size += typeof duration === 'number' ? duration : parseFloat(duration) || 0;
      });
      diff.size = size;
    }
    await models.MResource.update({ where: { _id: doc.res_id }, data: { $set: diff } });
    await got.post('http://192.168.0.124/gw/message/ws', {
      json: {
        resource_id: doc.res_id,
        resource_type: 'resource',
        status: CONST.STATUS.SUCCESS,
        type: 'resource_change',
      },
      responseType: 'json'
    });
  }
  await redis.del(`api:v1:resource:${doc.res_id}:detail`)
  response.success();
})

export default route;
