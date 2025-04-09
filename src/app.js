import _ from 'lodash'
import { fileURLToPath } from 'url';
import path from 'path'
import Koa from 'koa'
import Convert from 'koa-convert'
import Static from 'koa-static'
import Cors from 'koa2-cors'
import { koaBody } from 'koa-body'
import config from './config/index.js'
import log4js from 'log4js'
import Logger from './utils/logger.js'
import constant from './constant.js';
import getRoutes from './router.js'
import bizError from './middleware/bizError.js'
import needProject from './middleware/project.js'
import { BizError, genByBiz } from './utils/bizError.js'
import Mailer from './utils/mailer.js'
import Scheduler from './utils/scheduler.js';
import models, { dbs, initMongo } from './mongodb.js';
import ejs from 'ejs'
import { createClient } from 'redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = new Koa();
const logger = Logger('access');

app.response.success = function (data, params = {}) {
  const { status = 200, code = 0, message = '' } = params;
  const body = { code, message };
  if (!_.isNil(data)) {
    body.data = data;
  }
  this.status = status
  this.body = body;
}
app.response.fail = function (params = {}) {
  const { status = 200, code = -1, message = '' } = params;
  this.status = status;
  this.body = { code, message };
}
app.response.throwBiz = function (bizName, params) {
  throw new BizError(bizName, params);
}

app.request.paginate = function (fn) {
  const qs = app.request.query, hql = {};
  const page = qs[constant.SYSTEM.REQ_PAGE] || '1';
  const limit = qs[constant.SYSTEM.REQ_LIMIT] || '20';
  hql.page = Math.max(parseInt(_.isArray(page) ? page[0] : page), 1);
  hql.limit = Math.max(parseInt(_.isArray(limit) ? limit[0] : limit), 100);
  hql.where = {};
  if (fn) {
    fn(hql);
  }
  return hql;
}

// 加载model和业务逻辑层
app.context.config = config;
app.context.scheduler = Scheduler;
app.context.loadConfig = async function () {
  const docs = await app.context.models.MConfig.getAll({ lean: true });
  docs.forEach(item => {
    if (app.context.config[item.name]) {
      console.warn(`config ${item.name} covered`);
    }
    app.context.config[item.name] = item.value;
    if (item.type === 'email_template') {
      constant.emailTemplats[item.name] = ejs.compile(item.value.html);
    }
  })
}

app.use(bizError);
app.use(needProject);

const fn = log4js.connectLogger(logger, {});
app.use(async (ctx, next) => {
  fn(ctx.req, ctx.res, () => { });
  await next();
});

app.use(Cors());

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: constant.PATH.ROOT + '/.tmp',
    maxFields: 100,
    maxFieldsSize: 1024 * 1024 * 1024,
    keepExtensions: false,
  }
}));

app.use(Convert(Static(path.join(__dirname, '../static'))))

app.use(async (ctx, next) => {
  console.log(ctx.request.method, ctx.request.path)
  await next()
});

app.on('error', (err, ctx) => {
  console.log(err.message);
})

async function run(cb) {
  await initMongo(config.mongo_system_url);
  app.context.dbs = dbs;
  app.context.models = models;
  app.context.redis = await createClient({
    url: config.redis_url,
  });
  await app.context.redis.connect();
  // 连接数据库后,启动前加载配置
  await app.context.loadConfig();
  if (app.context.config.email) {
    app.context.mailer = new Mailer(app.context.config.email);
  }
  // 缓存
  app.context.getResourceByCache = async (res_id, all = false) => {
    const { MUser, MResource, MMediaChapter, MMediaPixiv, MMediaVideo, MMediaImage, MMediaAudio } = app.context.models;
    const key = `api:v1:resource:${res_id}:detail`;
    const redis = app.context.redis;
    let doc;
    const str = await redis.get(key);
    console.log(str, res_id)
    if (str) {
      doc = JSON.parse(str);
    } else {
      doc = await MResource.model.findOne({ _id: res_id }).lean(true);
      if (doc) {
        if (doc.source_type !== 'novel') {
          doc.chapters = await MMediaChapter.model.find({ res_id }, { content: 0 }).sort({ nth: 1 }).lean(true);
        } else {
          doc.chapters = [];
        }
        if (doc.spider_id === 'pixiv_image') {
          doc.images = await MMediaPixiv.model.find({ res_id }).sort({ nth: 1 }).lean(true);
        } else {
          doc.images = await MMediaImage.model.find({ res_id }).sort({ nth: 1 }).lean(true);
        }
        if (doc.source_type === 'movie' && !_.isEmpty(doc.actors)) {
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
          collections: 0,
        }
        if (redis) {
          await redis.set(key, JSON.stringify(doc));
          await redis.expire(key, 3600 * 6);
        }
      }
    }
    if (!all && doc) {
      doc.chapters = doc.chapters.map(v => _.omit(v, ['url']));
      doc.videos = doc.videos.map(v => _.omit(v, ['url']));
      doc.images = doc.images.map(v => _.omit(v, ['url']));
      doc.audios = doc.audios.map(v => _.omit(v, ['url']));
    }
    return doc;
  }
  const router = await getRoutes()
  app.use(router.routes());
  if (typeof cb === 'function') {
    await cb(app);
  }
  // 加载定时任务
  const schedules = await models.MSchedule.getAll({ lean: true });
  schedules.forEach(v => {
    Scheduler.load(v, app.context);
  })
  return app;
}
export {
  app,
  run
}