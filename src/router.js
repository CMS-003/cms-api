import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path'
import Router from 'koa-router'
import loader from './utils/loader.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = new Router({ prefix: '/api' });
const routeDir = path.join(__dirname, 'routes')

const filepaths = [];
loader({ dir: routeDir, recusive: true }, info => {
  const route = path.relative(routeDir, info.dir).replace(path.sep, '/')
  filepaths.push({ route, file: info.fullpath });
})

export default async function getRoutes() {
  for (let i = 0; i < filepaths.length; i++) {
    const { route, file } = filepaths[i];
    const subRouter = await import(pathToFileURL(file).href);
    if (subRouter && subRouter.default) {
      router.use(`/${route}`, subRouter.default.routes());
    }
  }
  return router;
}