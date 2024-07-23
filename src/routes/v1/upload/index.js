import Router from 'koa-router'
import _ from 'lodash'
import fs from 'fs'
import shortid from 'shortid'
import verify from '#middleware/verify.js'
import constant from '#constant.js'
import mime from 'mime'

const router = new Router();

router.post('/image', async ({ request, response }) => {
  const file = request.files.image
  if (_.isArray(file)) {
    return response.fail({ code: 400, message: '不支持上传多个文件' });
  } else {
    const filepath = `/upload/${shortid.generate()}.${mime.getExtension(file.mimetype)}`
    fs.renameSync(file.filepath, constant.PATH.STATIC + filepath)
    return response.success(filepath);
  }
})

export default router