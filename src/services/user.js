import _ from 'lodash'
import crypto from 'crypto'
import shortid from 'shortid'
import jwt from 'jsonwebtoken'
import config from '#config/index.js'
import { getRedis } from '#utils/redis.js';
import { BizError } from '#utils/bizError.js'

/**
 * @typedef {import('jsonwebtoken').JwtPayload} JwtPayload
 */
/**
 * @typedef {JwtPayload & {
*   id?: string,
*   status?: number
* }} User
*/

/**
 * 创建 access_token 和 refresh_token
 * @param {object} user 
 * @param {string} platform 
 * @param {string} device_id 
 * @returns 
 */
export async function createTokens(user, platform = 'web', device_id = '') {
  const redis = getRedis();
  user.id = user._id;
  /** @type {User} */
  const data = _.pick(user, ['id', 'avatar', 'status', 'nickname', 'account'])

  const access_jti = crypto.randomBytes(16).toString("hex");
  const access_token = jwt.sign({ ...data, jti: access_jti }, config.USER_TOKEN_SECRET, { expiresIn: '2h' })
  const refresh_jti = crypto.randomBytes(16).toString("hex");
  const refresh_token = jwt.sign({ user_id: data.id, jti: refresh_jti }, config.USER_TOKEN_SECRET, { expiresIn: '14d' });
  await redis
    .multi()
    .hSet(`token:access:jti:${access_jti}`, { user_id: data.id, platform, device_id })
    .expire(`token:access:jti:${access_jti}`, 7200)
    .hSet(`token:refresh:jti:${refresh_jti}`, { user_id: data.id, access_jti, platform, device_id })
    // 定时扫描删除
    // .zRemRangeByScore(`user:${_id}:refresh_token_list`, 0, Date.now() - 1209600)
    .exec();
  // TODO: device_id 推送; 平台: android,web,ios,ipad,tv,watch
  return { access_token, refresh_token, type: 'Bearer' };
}

/**
 * @param {string} access_token
 */
export async function verifyToken(access_token) {
  const redis = getRedis();
  try {
    const [, sign] = access_token.split(' ');
    // 解码
    /** @type {User} */
    const payload = jwt.decode(sign || '', { json: true });
    if (!payload || !payload.exp || !payload.id || !payload.jti) {
      throw new BizError("AUTH.tokenFail");
    }
    // 判断是否过期
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new BizError("AUTH.tokenExpired")
    }
    // 检查是防伪
    const user_id = await redis.hGet(`token:access:jti:${payload.jti}`, 'user_id');
    if (user_id !== payload.id) {
      throw new BizError("AUTH.tokenFail")
    } else {
      return payload;
    }
  } catch (e) {
    throw e;
  }
}
export async function refreshToken(payload, user, platform = 'web', device_id = '') {
  const redis = getRedis();
  const map = await redis.hGetAll(`token:refresh:jti:${payload.jti}`);
  if (_.isEmpty(map)) {
    throw new BizError('AUTH.tokenFail')
  }
  // 刷新 access_token 时删除旧的
  if (map.access_jti) {
    await redis.del(`token:access:jti:${map.access_jti}`);
  }
  const tokens = await createTokens(user, platform, device_id)
  return tokens
}
export async function getTempBindToken(sns) {
  const data = _.pick(sns, ['sns_id', 'sns_type', 'nickname', 'avatar', 'jti']);
  data.jti = shortid.generate();
  return jwt.sign(data, config.USER_TOKEN_SECRET, { expiresIn: 600 });
}
export async function signOut(user, refresh_token) {
  const redis = getRedis();
  try {
    await redis.del(`token:access:jti:${user.jti}`);
    const payload = jwt.decode(refresh_token, { json: true });
    const jti = _.get(payload, 'jti');
    await redis.del(`token:refresh:jti:${jti}`);
  } catch (e) {

  }
}