const _ = require('lodash')
const shortid = require('shortid')
const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = {
  genToken: (user) => {
    const data = _.pick(user, ['_id', 'avatar', 'status', 'nickname', 'account'])
    data.jti = shortid.generate();
    // TODO: device_id 推送; 平台: android,web,ios,ipad,tv,watch
    const token = jwt.sign(data, config.USER_TOKEN_SECRET, { expiresIn: 86400 })
    return token;
  }
};