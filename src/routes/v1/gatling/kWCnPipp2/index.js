import got from 'got'
import Router from 'koa-router'

const route = new Router();

route.post('/', async (ctx) => {
  const { models, query, request, response } = ctx;
  let { id, type } = query;

  let Media = null;
  switch (type) {
    case 'image':
      Media = models.MMediaImage;
      break;
    case 'video':
      Media = models.MMediaVideo;
      break;
    default: break;
  }
  if (!id || !Media) {
    return response.fail();
  }
  const doc = await Media.getInfo({ where: { _id: id }, lean: true });
  if (!doc) {
    return response.fail();
  }
  const record = await models.MRecord.getInfo({ where: { _id: doc.res_id }, lean: true });
  if (record) {
    if (record.origin.includes('bilibili.com') || record.origin.includes('youtube.com')) {
      type = 'dlp'
    }
  }
  const is_m3u8 = type === 'video' && doc.url.includes('m3u8');
  const resp = await got.post(`http://192.168.0.124:7777/auto/${is_m3u8 ? 'm3u8' : type}/${id}`, {
    json: {
      "data": {
        "proxy": false,
        "transcode": is_m3u8,
        "header": {}
      },
      "opts": {}
    }
  });
  response.success();
})

export default route;
