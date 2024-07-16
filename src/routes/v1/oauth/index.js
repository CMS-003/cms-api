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
    const doc = await models.User.getInfo({ where: { name: account } });
    if (doc && (!doc.pass || !doc.salt)) {
      return response.throwBiz('AUTH.PassError');;
    }
    if (doc && doc.isEqual(value)) {
      try {
        const info = _.pick(doc._doc, ['id', 'nickname', 'account', 'avatar', 'status']);
        const access_token = jwt.sign(info, config.USER_TOKEN_SECRET, { expiresIn: '2h', issuer: 'cms-manage' });
        response.success({ access_token, type: 'Bearer' });
      } catch (e) {
        // TokenExpiredError,JsonWebTokenError
        response.throwBiz('AUTH.VERIFY_FAIL');
      }
    } else {
      response.throwBiz('AUTH.USER_NOTFOUND');
    }
  } else if (type === 'email' || type === 'phone') {
    const doc = await models.Verification.getInfo({ where: { method: type, receiver: account, code: value, status: 1 }, lean: true });
    if (!doc || Date.now() - new Date(doc.createdAt).getTime() > 1000 * 600) {
      return response.fail({ message: '验证码已过期' });
    }
    const info = await models.User.getInfo({ where: { email: account }, lean: true });
    if (info) {
      await models.Verification.update({ where: { method: type, receiver: account, code: value }, data: { $set: { status: 2 } } })
      const access_token = jwt.sign(info, config.USER_TOKEN_SECRET, { expiresIn: '2h', issuer: 'cms-manage' });
      response.success({ access_token, type: 'Bearer' });
    } else {
      return response.fail({ message: '账号不存在' });
    }
  } else {
    response.fail();
  }
});

OauthRoute.post('/sign-up', async ({ request, models, response }) => {
  const info = request.body;
  const { type, account, value } = info;
  if (type === 'account') {
    const doc = await models.User.getInfo({ where: { name: account }, lean: true });
    if (doc) {
      return response.throwBiz('USER.AccountExisted');
    }
    const salt = randomstring.generate({ length: 10, charset: 'hex' });
    const pass = crypto.createHmac('sha1', salt).update(value).digest('hex').toString();
    const data = {
      _id: v4(),
      name: account,
      pass,
      salt,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 1,
    }
    await models.User.create(data);
    response.success(null, { message: '注册成功,请登录' });
  } else {
    response.fail({ message: '不支持的注册类型' })
  }
})

OauthRoute.get('active', async ({ request, response, models }) => {
  const code = request.query.code;
  if (!code) {
    return response.fail();
  }
  const doc = await models.Code.getInfo({ where: { method: 'email', type: 1, code }, lean: true });
  if (!doc || Date.now() - new Date(doc.createdAt).getTime() > 1000 * 600) {
    return response.fail({ message: '邮件已过期' });
  }
  const _id = v4();
  const data = {
    email: doc.receiver,
    account: _id,
    phone: '',
    nickname: '小虎牙',
    avatar: '',
    pass: '',
    salt: '',
    createdAt: new Date(),
    status: 1,
  }
  await models.User.create(data);
  await models.Code.update({ where: { _id: doc._id }, data: { $set: { status: 2 } } });
  response.body = `邮箱已激活,请使用邮箱登陆`
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