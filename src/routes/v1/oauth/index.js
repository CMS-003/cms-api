import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import randomstring from 'randomstring'
import random from '../../../utils/random.js'
import snsService from '../../../services/sns.js'

const OauthRoute = new Router();

OauthRoute.post('/sign-in', async ({ models, response, request, config }, next) => {
  const { type, account, value } = request.body;
  if (type === 'account') {
    const doc = await models.User.getInfo({ where: { account } });
    if (doc && (!doc.pass || !doc.salt)) {
      return response.throwBiz('AUTH.PassError');;
    }
    if (doc && doc.isEqual(value)) {
      try {
        const info = _.pick(doc._doc, ['_id', 'nickname', 'account', 'avatar', 'status']);
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
    const doc = await models.Sns.getInfo({ where: { _id: type, account } });
    if (doc) {
      const user = await models.User.getInfo({ where: { _id: doc.user_id } });
      if (user.isEqual(value)) {
        const access_token = jwt.sign(_.pick(user, ['_id', 'nickname', 'account', 'avatar', 'status']), config.USER_TOKEN_SECRET, { expiresIn: '2w', issuer: 'cms-manage' });
        response.success({ access_token, type: 'Bearer' });
      } else {
        response.throwBiz('AUTH.PassError');
      }
    } else {
      response.throwBiz('AUTH.USER_NOTFOUND');
    }
  }
})

OauthRoute.post('/sign-up', async ({ request, models, response }) => {
  const info = request.body;
  const { type, account, value } = info;
  if (type === 'account') {
    const doc = await models.User.getInfo({ where: { account }, lean: true });
    if (doc) {
      return response.throwBiz('USER.AccountExisted');
    }
    const salt = randomstring.generate({ length: 10, charset: 'hex' });
    const hmac = crypto.createHmac('sha1', salt);
    hmac.update(value);
    const pass = hmac.digest('hex').toString();
    const data = {
      _id: v4(),
      account: account,
      pass,
      salt
    }
    await models.User.create(data);
    response.success(null, { message: '注册成功,请登录' });
  } else {
    const doc = await models.Sns.getInfo({ where: { _id: type, account } });
    if (doc) {
      return response.throwBiz('USER.AccountExisted');
    }
    await models.User.create({ _id: v4(), nickname: '游客', account: random(6, 'ichar') })
    // TODO: 创建sns,并要求绑定
  }
})

OauthRoute.get('/sns/:type', async ({ config, request, params, response }) => {
  const token = request.get('authorization') || request.query.authorization || '';
  let user_id = 'none';
  try {
    const user = jwt.verify(_.isArray(token) ? token[0] : token || '', config.USER_TOKEN_SECRET)
    user_id = typeof user === 'string' ? '' : user._id;
  } catch (e) {
    console.log(e);
  }
  const url = snsService.signin('sns_' + params.type, user_id);
  response.redirect(url);
});

OauthRoute.post('/bind', async ({ query, request, response }) => {
  const { bind_token, ...data } = request.body;
  const access_token = await snsService.bind(bind_token, data)
  if (access_token) {
    response.success({ access_token, type: 'Bearer' });
  } else {
    response.fail('fail');
  }
})

OauthRoute.get('/sns/:type/callback', async (ctx) => {
  await snsService.callback(ctx, 'sns_' + ctx.params.type);
  // TODO: 返回result结果页面 成功,失败,取消 (如果强制绑定,则需要先跳绑定账号页面)
})

export default OauthRoute