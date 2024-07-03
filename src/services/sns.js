const config = require('../config/index.js')
const BLL = require('../BLL/index.js');
const { v4 } = require('uuid');
const random = require('../utils/random.js')
const randomstring = require('randomstring')
const userService = require('../services/user.js')
const superagent = require('superagent');
require('superagent-proxy')(superagent);
const { google } = require('googleapis');
const _ = require('lodash');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken')
const AlipaySdk = require('alipay-sdk').AlipaySdk;

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
];

module.exports = {
  signin: (type, user_id) => {
    const sns_config = config[type];
    if (!sns_config) {
      return '/404'
    }
    if (type === 'sns_github') {
      return `https://github.com/login/oauth/authorize?client_id=${sns_config.client_id}&scope=user:email&state=${user_id}`
    } else if (type === 'sns_google') {
      const oauth2Client = new google.auth.OAuth2(sns_config.client_id, sns_config.client_secret, sns_config.redirect_uris[0]);
      const authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes, include_granted_scopes: true, state: user_id });
      return authUrl
    } else if (type === 'sns_alipay') {
      const authUrl = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${sns_config.app_id}&scope=auth_user&redirect_uri=${sns_config.redirect_uri}&state=${user_id}`;
      return authUrl;
    } else if (type === 'sns_weibo') {
      return `https://api.weibo.com/oauth2/authorize?client_id=${sns_config.app_id}&response_type=code&redirect_uri=${sns_config.redirect_uri}`
    } else {
      return '/404'
    }
  },
  bind: async (token, data) => {
    try {
      const sns = jwt.verify(token, config.USER_TOKEN_SECRET);
      if (data.type === 'account') {
        const user = await BLL.userBLL.getInfo({ where: { account: data.account } });
        if (user.isEqual(data.value)) {
          await BLL.snsBLL.update({ where: { sns_id: sns.sns_id, sns_type: sns.sns_type }, data: { $set: { user_id: user._id } } });
          const access_token = userService.genToken(user);
          return access_token;
        }
      } else if (data.type === 'phone') {

      } else if (data.type === 'email') {

      }
    } catch (e) {
      console.log(e)
    }
  },
  callback: async (ctx, type) => {
    console.log(ctx.query);
    const sns_config = config[type];
    if (!sns_config) {
      return ctx.redirect(config.page_public_url + '/oauth/fail')
    }
    let sns_info = null;
    if (type === 'sns_github') {
      const date = new Date();
      let result;
      let detail;
      console.log('start get token')
      const respToken = await superagent.post(`https://github.com/login/oauth/access_token?client_id=${sns_config.client_id}&client_secret=${sns_config.client_secret}&code=${ctx.query.code}`).proxy(process.env.HTTP_PROXY).set('accept', 'application/json');
      if (respToken.statusCode === 200) {
        result = respToken.body;
      }
      console.log('got token start get detail')
      const access_token = result.access_token
      const respDetail = await superagent.get('https://api.github.com/user').set({ accept: 'application/json', Authorization: `token ${access_token}`, Origin: config.page_public_url, 'User-Agent': 'max-89757' }).proxy(process.env.HTTP_PROXY);
      if (respDetail.statusCode === 200) {
        detail = respDetail.body;
      }
      // TODO: 创建 sns_info表,重定向提示,(跳过或绑定账号),返回新token ; 已有user_id则直接返回token
      sns_info = {
        sns_id: `${detail.id}`,
        sns_type: 'github',
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        access_expired_at: new Date(date.getTime() + result.expires_in),
        refresh_expired_at: new Date(date.getTime() + result.refresh_token_expires_in),
        nickname: detail.login,
        avatar: detail.avatar_url,
        status: 1,
        detail,
      }

    } else if (type === 'sns_google') {
      const code = ctx.query.code;
      // 创建 OAuth2 客户端
      const oauth2Client = new google.auth.OAuth2(sns_config.client_id, sns_config.client_secret, sns_config.redirect_uris[0]);
      let { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      console.log('youtube 授权', JSON.stringify(tokens))
      const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
      const user_resp = await oauth2.userinfo.get()
      sns_info = {
        sns_id: user_resp.data.id,
        sns_type: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        nickname: user_resp.data.given_name,
        avatar: user_resp.data.picture,
        status: 1,
        detail: user_resp.data,
        access_expired_at: new Date(tokens.expiry_date),
        refresh_expired_at: new Date('2050-01-01'),
      }
    } else if (type === 'sns_alipay') {
      const authCode = ctx.query.auth_code;
      const alipaySdk = new AlipaySdk({
        appId: sns_config.app_id,
        privateKey: sns_config.app_secret_key,
        alipayPublicKey: sns_config.alipay_public_key,
      });
      const tokens = await alipaySdk.exec("alipay.system.oauth.token", { code: authCode, grant_type: "authorization_code" });
      const user = await alipaySdk.exec("alipay.user.info.share", { bizContent: {}, auth_token: tokens.accessToken }, {});
      sns_info = {
        sns_id: user.userId,
        sns_type: 'alipay',
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        access_expired_at: dayjs(tokens.authStart).add(tokens.expiresIn).toDate(),
        refresh_expired_at: dayjs(tokens.authStart).add(tokens.reExpiresIn).toDate(),
        nickname: user.nickName,
        avatar: user.avatar,
        status: 1,
        detail: _.omit(user, ['code', 'msg', 'traceId']),
      }
    } else if (type === 'sns_weibo') {
      const code = ctx.query.code;
      const resp = await superagent.post(`https://api.weibo.com/oauth2/access_token`).query({
        client_id: sns_config.app_id,
        client_secret: sns_config.app_secret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: sns_config.redirect_uri,
      });
      if (resp.statusCode === 200) {
        const resp2 = await superagent.get(`https://api.weibo.com/2/users/show.json`).query({
          access_token: resp.body.access_token,
          uid: resp.body.uid,
        });
        if (resp2.status === 200) {
          sns_info = {
            sns_id: resp2.body.id,
            sns_type: 'weibo',
            access_token: resp.body.access_token,
            refresh_token: '',
            nickname: resp2.body.name,
            avatar: resp2.body.profile_image_url,
            status: 1,
            detail: resp2.body,
            access_expired_at: new Date(Date.now() + resp.body.expires_in),
            refresh_expired_at: null,
          }
        } else {
          return ctx.redirect(config.page_public_url + '/oauth/fail')
        }
      } else {
        return ctx.redirect(config.page_public_url + '/oauth/fail')
      }
    }
    if (sns_info) {
      if (ctx.query.state && ctx.query.state !== 'none') {
        sns_info.user_id = ctx.query.state;
      }
      await BLL.snsBLL.model.updateOne({ sns_id: sns_info.sns_id, sns_type: sns_info.sns_type }, { $set: sns_info, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
      const sns = await BLL.snsBLL.getInfo({ where: { sns_id: sns_info.sns_id, sns_type: sns_info.sns_type }, lean: true })
      if (!sns.user_id) {
        const bind_token = await userService.getTempBindToken(sns_info)
        return ctx.redirect(config.page_public_url + '/oauth/bind?bind_token=' + bind_token);
      }
      const user = await BLL.userBLL.getInfo({ where: { _id: sns.user_id }, lean: true });
      const token = await userService.genToken(user)
      return ctx.redirect(config.page_public_url + '/oauth/success?access_token=' + token);
    } else {
      return ctx.redirect(config.page_public_url + '/oauth/fail')
    }
  },
  cancel: async (ctx, type) => {
    const sns_config = config['sns_' + type];
    const user = ctx.state.user;
    await BLL.snsBLL.model.updateOne({ user_id: user._id, sns_type: type }, { $set: { status: 0 } });
    const sns_info = await BLL.snsBLL.getInfo({ where: { user_id: user._id, sns_type: type }, lean: true })
    if (!sns_config || !sns_info) {
      return;
    }
    if (type === 'github') {
      const resp = await superagent.del(`https://api.github.com/applications/${sns_config.client_id}/grants/${sns_info.access_token}`)
        .proxy(process.env.HTTP_PROXY)
        .set({
          Authorization: `Basic ${Buffer.from(`${sns_config.client_id}:${sns_config.client_secret}`).toString('base64')}`,
          Accept: 'application/vnd.github.v3+json',
        });
      return;
    } else if (type === 'google') {
      const oauth2Client = new google.auth.OAuth2(sns_config.client_id, sns_config.client_secret, sns_config.redirect_uris[0]);
      oauth2Client.setCredentials(_.pick(sns_info, ['access_token', 'refresh_token']));
      await oauth2Client.revokeToken(sns_info.access_token)
      return;
    } else if (type === 'alipay') {
      const alipaySdk = new AlipaySdk({
        appId: sns_config.app_id,
        privateKey: sns_config.app_secret_key,
        alipayPublicKey: sns_config.alipay_public_key,
      });
    }
  },
}