import Router from 'koa-router'
import _ from 'lodash'
import crypto from 'crypto'
import { v7 } from 'uuid';
import verify from '#middleware/verify.js';

const route = new Router();

async function replace(models, o, sync) {
  const { sns_id, sns_type, nickname } = o;
  const sns = await models.MSns.getInfo({ where: { sns_id, sns_type }, lean: true })
  if (sns) {
    return sns.user_id;
  } else {
    const user_id = v7();
    const _id = crypto.createHash('md5').update(`${sns_type}|${sns_id}`).digest('hex');
    await models.MSns.create({
      _id,
      sns_id,
      sns_type,
      nickname,
      user_id,
      avatar: '',
      detail: {},
      status: 1,
      createdAt: new Date(),
      access_token: '',
      refresh_token: '',
    });
    await models.MUser.create({
      _id: user_id,
      name: nickname,
      nickname,
      email: '',
      phone: '',
      avatar: '',
      pass: '',
      salt: '',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    sync && await models.MResource.update({ where: { uid: sns_id }, data: { $set: { uid: user_id } } });
    return user_id;
  }
}

route.post('/user/create-by-sns', async ({ request, params, models, response }) => {
  if (!_.isArray(request.body)) {
    const user_id = await replace(models, request.body, request.query.sync);
    response.success({ user_id })
  } else {
    const ids = [];
    for (let i = 0; i < request.body.length; i++) {
      const user_id = await replace(models, request.body[i], request.query.sync);
      ids.push(user_id)
    }
    response.success({ user_id: ids });
  }
});

route.post('/user/sync-to-actor', async ({ request, params, models, response }) => {
  const { sns_id, sns_type } = request.body;
  const sns = await models.MSns.getInfo({ where: { sns_id, sns_type }, lean: true });
  if (!sns) {
    return response.fail();
  }
  await models.MResource.update({ where: { 'actors._id': sns_id }, data: { $set: { 'actors.$._id': sns.user_id } } });
  response.success();
});

route.post('/user/follow/:user_id', verify, async ({ request, state, params, models, response }) => {
  const data = {
    follower_id: state.user.id,
    followee_id: params.user_id,
    _id: v7(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const doc = await models.MFollow.getInfo({ where: _.pick(data, ['followee_id', 'follower_id']), lean: true })
  if (doc) {
    return response.fail();
  }
  await models.MFollow.create(data)
  response.success();
})

route.delete('/user/follow/:user_id', verify, async ({ request, state, params, models, response }) => {
  const where = {
    follower_id: state.user.id,
    followee_id: params.user_id,
  }
  await models.MFollow.destroy({ where })
  response.success();
})

export default route