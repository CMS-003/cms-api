import { getRedis } from '#utils/redis.js';
import _ from 'lodash'
import models from '#mongodb.js';

/**
 * 资源详情
 * @param {string} res_id 
 * @param {string} user_id 
 * @param {boolean} all 
 * @returns 
 */
export async function getResourceInfo(res_id, user_id, all = false) {
  const { MUser, MResource, MMediaChapter, MMediaPixiv, MMediaVideo, MMediaImage, MMediaAudio, MStar, MHistory } = models;
  const key = `api:v1:resource:${res_id}:detail`;
  const redis = getRedis();
  let doc;
  const str = redis ? await redis.get(key) : null;
  console.log(str, res_id)
  if (str) {
    doc = JSON.parse(str);
    if (doc.type !== 'post') {
      doc.content = ''
    }
  } else {
    doc = await MResource.model.findOne({ _id: res_id }).lean(true);
    if (doc) {
      if (doc.type !== 'novel') {
        doc.chapters = await MMediaChapter.model.find({ res_id }, { content: 0 }).sort({ nth: 1 }).lean(true);
      } else {
        doc.chapters = [];
      }
      if (doc.type === 'pixiv') {
        doc.images = await MMediaPixiv.model.find({ res_id }).sort({ nth: 1 }).lean(true);
      } else {
        doc.images = await MMediaImage.model.find({ res_id }).sort({ nth: 1 }).lean(true);
      }
      if (doc.type === 'movie' && !_.isEmpty(doc.actors)) {
        const actors = await MUser.model.find({ _id: { $in: doc.actors.map(a => a._id) } }, { salt: 0, password: 0, source_id: 0, spider_id: 0 }).lean(true);
        doc.actors = actors.map(a => ({ _id: a._id, name: a.nickname, avatar: a.avatar }));
      }
      doc.videos = await MMediaVideo.model.find({ res_id }).sort({ nth: 1 }).lean(true);
      doc.audios = await MMediaAudio.model.find({ res_id }).sort({ nth: 1 }).lean(true);
      doc.counter = {
        chapters: doc.chapters.length,
        images: doc.images.length,
        videos: doc.videos.length,
        audios: doc.audios.length,
        comments: 0,
      }
      if (redis) {
        await redis.set(key, JSON.stringify(doc));
        await redis.expire(key, 3600 * 6);
      }
    } else {
      return null
    }
  }

  const collects = await MStar.count({ where: { rid: res_id } });
  const collected = await MStar.count({ where: { rid: res_id, uid: user_id } }) ? true : false;
  doc.counter.collects = collects;
  doc.counter.collected = collected;
  const history = await MHistory.getInfo({ where: { resource_id: res_id, user_id }, sort: { created_at: -1 }, lean: true })
  if (!all && doc) {
    doc.chapters = doc.chapters.map(v => _.omit(v, ['url']));
    doc.videos = doc.videos.map(v => _.omit(v, ['url']));
    doc.images = doc.images.map(v => _.omit(v, ['url']));
    doc.audios = doc.audios.map(v => _.omit(v, ['url']));
  }
  if (history) {
    doc.detail = history;
  }
  return doc;
}