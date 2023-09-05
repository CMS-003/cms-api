const config = require('../config/index.js')
const fetch = require('node-fetch')
const BLL = require('../BLL/index.js');
const { v4 } = require('uuid');
const random = require('../utils/random.js')
const randomstring = require('randomstring')
const userService = require('../services/user.js')
const superagent = require('superagent');
require('superagent-proxy')(superagent);

module.exports = {
  signin: (type) => {
    const sns_config = config[type];
    if (!sns_config) {
      return '/404'
    }
    if (type === 'sns_github') {
      return `https://github.com/login/oauth/authorize?client_id=${sns_config.client_id}&scope=user:email`
    } else {
      return '/404'
    }
  },
  callback: async (ctx, type) => {
    const sns_config = config[type];
    if (!sns_config) {
      return ctx.redirect(config.page_public_url + '/oauth/fail')
    }
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
      const sns_info = {
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
      const user_id = v4();
      const r = await BLL.snsBLL.model.updateOne({ sns_id: sns_info.sns_id, sns_type: sns_info.sns_type }, { $set: sns_info, $setOnInsert: { user_id } }, { upsert: true });
      if (r.upsertedCount === 1) {
        await BLL.userBLL.model.updateOne({ _id: user_id }, {
          $set: {
            account: random(6, 'ichar'),
            nickname: sns_info.nickname,
            avatar: sns_info.avatar,
            pass: '',
            salt: randomstring.generate({ length: 10, charset: 'hex' }),
            status: 1
          }
        }, { upsert: true });
      }
      const sns = await BLL.snsBLL.getInfo({ where: { sns_id: sns_info.sns_id, sns_type: sns_info.sns_type }, lean: true });
      const user = await BLL.userBLL.getInfo({ where: { _id: sns.user_id }, lean: true });
      const token = await userService.genToken(user)
      ctx.set('cookie', 'access_token=' + token)
      return ctx.redirect(config.page_public_url + '/oauth/success')
    } else {
      return ctx.redirect(config.page_public_url + '/oauth/fail')
    }
  }
}