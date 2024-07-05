import _ from 'lodash'
import shortid from 'shortid'
import jwt from 'jsonwebtoken'
import config from '../config/index.js'

export default {
  genToken: (user) => {
    const data = _.pick(user, ['_id', 'avatar', 'status', 'nickname', 'account'])
    data.jti = shortid.generate();
    // TODO: device_id 推送; 平台: android,web,ios,ipad,tv,watch
    const token = jwt.sign(data, config.USER_TOKEN_SECRET, { expiresIn: 86400 })
    return token;
  },
  getTempBindToken: (sns) => {
    const data = _.pick(sns, ['sns_id', 'sns_type', 'nickname', 'avatar']);
    data.jti = shortid.generate();
    return jwt.sign(data, config.USER_TOKEN_SECRET, { expiresIn: 600 });
  }
};