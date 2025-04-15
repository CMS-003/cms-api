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
import { initRedis } from './utils/redis.js'
import constant from './constant.js';
import getRoutes from './router.js'
import bizError from './middleware/bizError.js'
import needProject from './middleware/project.js'
import { BizError, genByBiz } from './utils/bizError.js'
import Mailer from './utils/mailer.js'
import Scheduler from './utils/scheduler.js';
import models, { dbs, initMongo } from './mongodb.js';
import ejs from 'ejs'

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
  const qs = this.query, hql = {};
  const page = qs[constant.SYSTEM.REQ_PAGE] || '1';
  const limit = qs[constant.SYSTEM.REQ_LIMIT] || '20';
  hql.page = Math.max(parseInt(_.isArray(page) ? page[0] : page), 1);
  hql.limit = Math.min(parseInt(_.isArray(limit) ? limit[0] : limit), 100);
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
  app.context.redis = await initRedis();

  // 连接数据库后,启动前加载配置
  await app.context.loadConfig();
  if (app.context.config.email) {
    app.context.mailer = new Mailer(app.context.config.email);
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