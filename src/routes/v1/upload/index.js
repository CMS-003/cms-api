const Router = require('koa-router')
const _ = require('lodash');
const fs = require('fs')
const shortid = require('shortid')
const userVerify = require('../../../middleware/user_verify.js');
const constant = require('../../../constant.js');
const mime = require('mime')

const templateRoute = new Router();

templateRoute.post('/image', userVerify, async ({ request, response }) => {
  const file = request.files.image
  const filepath = `/upload/${shortid.generate()}.${mime.getExtension(file.mimetype)}`
  fs.renameSync(file.filepath, constant.PATH.STATIC + filepath)
  // fs.unlinkSync(file.filepath)
  response.success({ filepath })
})

module.exports = templateRoute