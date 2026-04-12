import Router from 'koa-router'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import mime from 'mime'
import shortid from 'shortid'
import constant from '#constant.js'

const route = new Router();

route.get('/remote/app/:app/versions', async ({ request, response, models }) => {
  const { MVersion } = models;
  const query = request.paginate(hql => {
    hql.sort = { createdAt: -1 };
    hql.lean = true;
    return hql;
  });
  const list = await MVersion.getList(query);
  response.success({ items: list });
})

route.get('/remote/app/:app/version/:version', async ({ request, params, models, response }) => {
  const { MProject, MVersion } = models;
  const app = await MProject.getInfo({ where: { name: params.app, status: 1 }, lean: true });
  if (!app) {
    return response.fail({ code: -1, message: '应用不存在或已下线' })
  }
  const version = params.version === 'latest'
    ? await MVersion.model.findOne({ app: params.app, status: 1 }).sort({ createdAt: -1 }).lean(true)
    : await MVersion.getInfo({ where: { app: params.app, status: 1 }, lean: true });
  if (!version) {
    return response.fail({ code: -1, message: '没有可用版本' })
  }
  response.success(version)
})

route.post('/remote/app/:app/version/:version', async ({ request, params, body, models, response }) => {
  const file = request.files.file
  if (_.isArray(file) || !file) {
    return response.fail({ code: 400, message: '文件错误' });
  } else {
    const _id = shortid.generate()
    const filepath = `/upload/apps/${_id}.${mime.getExtension(file.mimetype)}`
    fs.mkdirSync(path.dirname(constant.PATH.STATIC + filepath), { recursive: true })
    fs.copyFileSync(file.filepath, constant.PATH.STATIC + filepath)
    fs.unlinkSync(file.filepath)

    const { MProject, MVersion } = models;
    const app = await MProject.getInfo({ where: { name: params.app, status: 1 }, lean: true });
    if (!app) {
      return response.fail({ code: -1, message: '应用不存在或已下线' })
    }
    await MVersion.create({
      _id,
      version: params.version,
      app: params.app,
      name: app.name,
      desc: request.body.desc || '',
      path: filepath,
      status: 1,
      createdAt: new Date()
    })
    return response.success(filepath);
  }
})

export default route