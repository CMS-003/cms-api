import Router from 'koa-router'
import _ from 'lodash'
import fs from 'fs'
import shortid from 'shortid'
import verify from '../../../middleware/verify.js'
import constant from '../../../constant.js'
import mime from 'mime'

const templateRoute = new Router();

templateRoute.post('/image', verify, async ({ request, response }) => {
  const file = request.files.image
  const filepath = `/upload/${shortid.generate()}.${mime.getExtension(file.mimetype)}`
  fs.renameSync(file.filepath, constant.PATH.STATIC + filepath)
  // fs.unlinkSync(file.filepath)
  response.success({ filepath })
})

export default templateRoute