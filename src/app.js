const _ = require('lodash');
const path = require('path');
const Koa = require('koa');
const Convert = require('koa-convert');
const Static = require('koa-static');
const Cors = require('koa2-cors');
const { koaBody } = require('koa-body')
const config = require('./config/index');
const log4js = require('log4js');
const logger = require('./utils/logger')('access');
const constant = require('./constant');
const router = require('./router');
const BLL = require('./BLL/index');
const bizError = require('./middleware/bizError');
const needProject = require('./middleware/project.js');
const { BizError, genByBiz } = require('./utils/bizError')
const loadSchedule = require('./schedule/index');
const { default: mongoose } = require('mongoose');
const qs = require('querystring')

const app = new Koa();

app.response.success = function (data, params = {}) {
  const { status = 200, code = 0, message = '' } = params;
  const body = { code, message };
  if (!_.isNil(data)) {
    body.data = data;
  }
  this.status = status
  this.body = body;
}
app.response.throwBiz = function (bizName, params) {
  throw new BizError(bizName, params);
}

app.request.paging = function () {
  const qs = app.request.query, hql = {};
  let page = parseInt(qs[constant.SYSTEM.REQ_PAGE]) || 1;
  let limit = parseInt(qs[constant.SYSTEM.REQ_LIMIT]) || 20;
  hql.page = Math.max(page, 1);
  hql.limit = Math.min(limit, 20);
  hql.where = {};
  return hql;
}

// 加载model和业务逻辑层
app.config = config;
app.BLL = BLL;

app.use(bizError);
app.use(needProject);

const fn = log4js.connectLogger(logger);
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
  ctx.models = app.models
  ctx.BLL = app.BLL
  ctx.config = app.config;

  await next()
});

app.use(router.routes())

app.on('error', (err, ctx) => {
  console.log(err.message);
})


module.exports = {
  app,
  run: async function (cb) {
    app.db = await mongoose.connect(config.mongo_url);
    // 连接数据库后,启动前加载配置
    const config_items = await app.BLL.configBLL.getAll({ lean: true })
    config_items.forEach(item => {
      if (app.config[item.name]) {
        console.warn(`config ${item.name} covered`);
      }
      app.config[item.name] = item.value;
    })
    app.schedule = await loadSchedule(app);
    if (typeof cb === 'function') {
      await cb(app);
    }
    return app;
  }
};
