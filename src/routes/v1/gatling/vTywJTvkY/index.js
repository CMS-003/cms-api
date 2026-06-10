import fs from 'fs'
import path from 'path'
import Router from 'koa-router'

const route = new Router();

route.post('/', async (ctx) => {
  const { consts, models, request, response } = ctx;
  try {
    const file = request.files.file;
    const filepath = file.filepath;
    const fullpath = path.join('/cms/static', request.body.filepath);

    fs.mkdirSync(path.dirname(fullpath), { recursive: true });
    fs.copyFileSync(filepath, fullpath)
    fs.unlinkSync(filepath)
    response.success();
  } catch (e) {
    console.log(e);
    response.fail();
  }
})

export default route;
