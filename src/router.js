import { fileURLToPath } from 'url';
import path from 'path'
import Router from 'koa-router'
import loader from './utils/loader.js'
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = new Router({ prefix: '/api' });
const routeDir = path.join(__dirname, 'routes')

loader({ dir: routeDir, recusive: true }, info => {
  import(info.fullpath).then(subRouter => {
    const route = path.relative(routeDir, info.dir).replace(path.sep, '/')
    if (subRouter && subRouter.default.routes) {
      router.use(`/${route}`, subRouter.default.routes())
    }
  })
})

export default router