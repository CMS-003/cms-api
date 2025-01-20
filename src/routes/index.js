import Router from 'koa-router'
import http from 'http'
import _ from 'lodash'
import config from '#config/index.js';

const home = new Router();

home.get('/', async (ctx) => {
  console.log('home')
  ctx.body = 'Hello World!';
})

home.post('test/email', async (ctx) => {
  const data = _.pick(ctx.request.body, ['users', 'subject', 'html']);
  if (_.isEmpty(data.users)) {
    return ctx.response.throwBiz('COMMON.NeedParam', { param: 'users' })
  }
  if (_.isEmpty(data.subject)) {
    return ctx.response.throwBiz('COMMON.NeedParam', { param: 'subject' })
  }
  if (_.isEmpty(data.html)) {
    return ctx.response.throwBiz('COMMON.NeedParam', { param: 'html' })
  }
  if (ctx.mailer) {
    ctx.mailer.sendMail(data.users, data.subject, data.html);
    ctx.response.success()
  } else {
    ctx.response.throwBiz('COMMON.NeedParam', { param: 'config' })
  }
})

const proxy = new Router();
proxy.all('/(.*)', async (ctx) => {
  const [hostname = '127.0.0.1', port = 80] = config.proxy_host.split(':');
  const proxy_url = ctx.url.substring(10)
  const options = {
    hostname, // 目标服务器地址
    port,              // 目标服务器端口
    path: proxy_url,          // 保留原始请求路径
    method: ctx.method,     // 保留原始请求方法
    headers: ctx.headers    // 转发原始请求头
  };
  await new Promise((resolve, reject) => {
    const proxyReq = http.request(options, (proxyRes) => {
      // 设置返回的状态码和头部
      ctx.status = proxyRes.statusCode;
      ctx.set(proxyRes.headers);

      // 转发数据流
      proxyRes.pipe(ctx.res);
      proxyRes.on('end', resolve);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      ctx.status = 500;
      ctx.body = 'Error forwarding request';
      reject(err);
    });

    // 将请求体转发到目标服务器
    ctx.req.pipe(proxyReq);
  });
});

home.use('proxy', proxy.routes(), proxy.allowedMethods());

export default home