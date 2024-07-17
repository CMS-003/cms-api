import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'
import random from '../../../utils/random.js';
import constant from '../../../constant.js';


const router = new Router();

router.get('/codes', async ({ models, response, request }) => {
  const hql = request.paging();
  hql.sort = { createdAt: 1 };
  hql.lean = true;
  if (hql.where.type) {
    hql.where.type = _.isArray(request.query.type) ? request.query.type.map(t => parseInt(t)) : parseInt(request.query.type);
  }
  if (request.query.user_id) {
    hql.where = { user_id: request.query.user_id }
  }
  if (request.query.method) {
    hql.where = { method: request.query.method }
  }
  const items = await models.Verification.getList(hql);
  response.success({ items });
})

router.get('/codes/:id', async ({ params, models, response }) => {
  const where = { _id: params.id };
  const item = await models.Verification.getInfo({ where });
  response.success({ item });
})

router.post('/codes', async ({ request, mailer, response, models, }) => {
  const data = request.body;
  data.code = random(6);
  data.user_id = '';
  data.status = 1;
  data.createdAt = new Date();
  data._id = v4();
  try {
    if (data.method === 'email') {
      const user = await models.User.getInfo({ where: { email: data.receiver }, lean: true });
      if (user && data.type === 2) {
        data.user_id = user._id;
        if (constant.emailTemplats.email_template_login) {
          data.content = constant.emailTemplats.email_template_login({ name: user.nickname, code: data.code });
        }
        await models.Verification.create(data);
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
          data.content = constant.emailTemplats.email_template_register({ code: data.code });
          await models.Verification.create(data);
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
    response.fail(e);
  }
});

router.put('/codes/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  const data = request.body
  await models.Verification.update({ where, data });
  response.success();
});

router.del('/codes/:id', async ({ params, request, response, models }) => {
  const where = { _id: params.id };
  await models.Verification.destroy({ where });
  response.success();
});

export default router