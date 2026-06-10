import config from './config/index.js'
import { run } from './app.js'
import constant from '#constant.js';

function getRoutesFromApp(koaApp) {
  const allRoutes = [];

  // 遍历 app 中注册的所有中间件
  koaApp.middleware.forEach((middleware) => {
    // 关键点：@koa/router 导出的中间件上会挂载一个 `router` 属性指向原实例
    if (middleware.router && middleware.router.stack) {

      middleware.router.stack.forEach((layer) => {
        const methods = layer.methods.filter(m => constant.VALID_METHODS.includes(m));

        // 确保是有效的路由（有具体的 HTTP 请求方法）
        methods.forEach(method => {
          allRoutes.push({ path: layer.path, method })
        });
      });

    }
  });

  return allRoutes;
}
run(async (app) => {
  const routes = getRoutesFromApp(app);
  app.context.redis.set('api:v1:routes', JSON.stringify(routes));
  app.listen(config.PORT, () => {
    console.log(`app listening at: ${config.PORT}`);
  })
})
