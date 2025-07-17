import Router from 'koa-router'
import _ from 'lodash'
import DeviceDetector from 'device-detector-js'
import { v7 } from 'uuid'
import verify from '#middleware/verify.js';
import { verifyToken } from '#services/user.js';
import { getResourceInfo } from '#services/resource.js';

const route = new Router();

/**
 * @method 获取客户端IP地址
 * @param {any} req 传入请求HttpRequest
 * 客户请求的IP地址存在于request对象当中
 * express框架可以直接通过 req.ip 获取
 */
function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    req.ip ||
    '';
}

route.post('/history', verify, async ({ state, models, request, response }) => {
  try {
    const { MHistory, MStat } = models;
    /**
     * @type {any}
     */
    const data = _.pick(request.body, ['resource_id', 'resource_type', 'media_id', 'media_type', 'total', 'watched']);
    const info = new DeviceDetector().parse(request.get('User-Agent'));
    data.created_at = new Date()
    data._id = v7();
    data.ip = getClientIp(request);
    data.device = info.device.type;
    data.user_id = state.user.id;
    await MHistory.update({ where: { resource_id: data.resource_id, user_id: data.user_id }, data: { $set: _.pick(data, ['created_at', 'watched', 'device', 'ip', 'media_id']), $setOnInsert: _.omit(data, ['created_at', 'watched', 'device', 'ip', 'media_id']) }, options: { upsert: true } });
    await MStat.create({
      type: 1,
      ...(_.pick(data, ['_id', 'resource_id', 'resource_type', 'user_id', 'created_at']))
    })
    response.success();
  } catch (e) {
    console.log(e)
    response.fail()
  }
  response.success({})
})

route.get('/history', verify, async ({ state, request, models, response }) => {
  try {
    const { MHistory } = models;
    const query = request.paginate(hql => {
      hql.where = {
        user_id: state.user.id,
      };
      if (request.query.type) {
        hql.where.resource_type = request.query.type
      }
      hql.sort = { created_at: -1 };
      hql.attrs = { ip: 0 };
      hql.lean = true;
      return hql;
    });
    const list = await MHistory.getList(query);
    const arr = [];
    list.forEach(history => {
      arr.push(new Promise((resolve) => {
        resolve(getResourceInfo(history.resource_id, state.user.id, false));
      }))
    })
    const results = await Promise.all(arr);
    results.forEach((v, i) => {
      // @ts-ignore
      v.detail = list[i];
    })
    response.success({ items: results });
  } catch (e) {
    response.fail()
  }
})

route.del('/history/:_id', verify, async ({ state, params, models, request, response }) => {
  const { MHistory } = models;
  const where = { user_id: state.user.id, resource_id: params._id };
  await MHistory.destroy({ where })
  response.success();
})

export default route