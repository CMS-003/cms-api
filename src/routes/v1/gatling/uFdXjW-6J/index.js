import { v7 } from 'uuid'
import sparkmd5 from 'spark-md5'
import Router from 'koa-router'
import { suid } from '#utils/suid.js';
import got from 'got'

const route = new Router();

route.use('/', async (ctx) => {
  const { models, request, response } = ctx;
  if (ctx.query.type === 'resource_id') {
    const id = sparkmd5.hash(ctx.query.spider_id + '|' + ctx.query.source_id);
    response.success(id);
  } else if (ctx.query.type === 'v7') {
    const id = v7();
    response.success(id);
  } else if (ctx.query.type === 'cwd') {
    response.success(process.cwd())
  } else {
    response.success();
  }
})

export default route;
