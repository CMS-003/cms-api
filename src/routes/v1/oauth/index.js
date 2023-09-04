const Router = require('koa-router')
const _ = require('lodash');
const uuid = require('uuid');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')
const random = require('../../../utils/random.js')

const OauthRoute = new Router();

OauthRoute.post('/sign-in', async ({ BLL, response, request, config }, next) => {
  const { type, account, value } = request.body;
  if (type === 'account') {
    const doc = await BLL.userBLL.getInfo({ where: { account } });
    if (doc && (!doc.pass || !doc.salt)) {
      return response.throwBiz('AUTH.PassError');;
    }
    if (doc && doc.isEqual(value)) {
      try {
        const info = _.pick(doc._doc, ['_id', 'nickname', 'account']);
        console.log(info)
        const access_token = jwt.sign(info, config.USER_TOKEN_SECRET, { expiresIn: '2h', issuer: 'cms-manage' });
        response.success({ access_token, type: 'Bearer' });
      } catch (e) {
        // TokenExpiredError,JsonWebTokenError
        response.throwBiz('AUTH.VERIFY_FAIL');
      }
    } else {
      response.throwBiz('AUTH.USER_NOTFOUND');
    }
  } else {
    const doc = await BLL.snsBLL.getInfo({ where: { _id: type, account } });
    if (doc) {
      const user = await BLL.userBLL.getInfo({ where: { _id: doc.user_id } });
      if (user.isEqual(value)) {
        const access_token = jwt.sign(_.pick(user, ['_id', 'nickname']), config.USER_TOKEN_SECRET, { expiresIn: '2h', issuer: 'cms-manage' });
        response.success({ access_token, type: 'Bearer' });
      } else {
        response.throwBiz('AUTH.PassError');
      }
    } else {
      response.throwBiz('AUTH.USER_NOTFOUND');
    }
  }
})

OauthRoute.post('/sign-up', async ({ request, BLL, response }) => {
  const info = request.body;
  const { type, account, value } = info;
  if (type === 'account') {
    const doc = await BLL.userBLL.getInfo({ where: { account }, lean: true });
    if (doc) {
      return response.throwBiz('USER.AccountExisted');
    }
    const salt = randomstring.generate({ length: 10, charset: 'hex' });
    const hmac = crypto.createHmac('sha1', salt);
    hmac.update(value);
    const pass = hmac.digest('hex').toString();
    const data = {
      _id: uuid.v4(),
      account: account,
      pass,
      salt
    }
    await BLL.userBLL.create(data);
    response.success(null, { message: '注册成功,请登录' });
  } else {
    const doc = await BLL.snsBLL.getInfo({ where: { _id: type, account } });
    if (doc) {
      return response.throwBiz('USER.AccountExisted');
    }
    await BLL.userBLL.create({ _id: uuid.v4(), nickname: '游客', account: random(6, 'ichar') })
    // TODO: 创建sns,并要求绑定
  }
})

OauthRoute.get('/sns/:type', async () => {

});

module.exports = OauthRoute