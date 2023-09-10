const path = require('path')
const Router = require('koa-router')
const router = new Router({ prefix: '/api' });
const loader = require('./utils/loader');

const routeDir = path.join(__dirname, 'routes')

loader({ dir: routeDir, recusive: true }, info => {
  const subRouter = require(info.fullpath);
  const route = path.relative(routeDir, info.dir).replace(path.sep, '/')
  if (subRouter && subRouter.routes) {
    router.use(`/${route}`, subRouter.routes())
  }
})

module.exports = router