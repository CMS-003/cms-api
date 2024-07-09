import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'
import random from '../../../utils/random.js';
import constant from '../../../constant.js';


const route = new Router();

route.get('/codes/', async ({ models, response, request }) => {
  const hql = request.paging();
  hql.sort = { createdAt: 1 };
  hql.lean = true;
  hql.where = _.pick(request.query, ['type', 'user_id', 'method', 'receiver']);
  if (hql.where.type) {
    hql.where.type = parseInt(request.query.type);
  }
  if (request.query.user_id) {
    hql.where = { type: request.query.user_id }
  }
  if (request.query.method) {
    hql.where = { method: request.query.method }
  }
  const items = await models.Code.getList(hql);
  response.success({ items });
})

route.get('/codes/:id', async ({ params, models, response }) => {
  const where = { _id: params.id };
  const item = await models.Code.getInfo({ where });
  response.success({ item });
})

route.post('/codes', async ({ request, mailer, response, models }) => {
  const data = request.body;
  data.code = random(6);
  data.user_id = '';
  data.status = 1;
  data.create = new Date();
  try {
    if (data.method === 'email') {
      const user = await models.User.getInfo({ where: { email: data.receiver }, lean: true });
      if (user && data.type === 2) {
        data.user_id = user._id;
        if (constant.emailTemplats.email_template_login) {
          data.content = constant.emailTemplats.email_template_login({ name: user.nickname, code: data.code });
        }
        await models.Code.create(data);
        if (mailer) {
          mailer.sendMail([{ name: user.nickname, email: user.email }], '验证帐户', data.content).then(() => {
            console.log('send');
          })
        }
        return response.success();
      } else if (data.type === 1) {
        if (user) {
          return response.fail({ message: '此邮箱已被注册' });
        }
        if (constant.emailTemplats.email_template_register) {
          data.code = v4();
          data.content = constant.emailTemplats.email_template_register({ code: data.code });
          await models.Code.create(data);
          if (mailer) {
            mailer.sendMail([{ name: user.nickname, email: user.email }], '注册帐户', data.content).then(() => {
              console.log('send');
            })
          }
          return response.success();
        }
      }
    } else {
      response.fail({ message: 'NotFound' })
    }
    response.fail()
  } catch (e) {
    response(e);
  }
});

route.put('/codes/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  const data = request.body
  await models.Code.update({ where, data });
  response.success();
});

route.del('/codes/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  await models.Code.destroy({ where });
  response.success();
});

export default route