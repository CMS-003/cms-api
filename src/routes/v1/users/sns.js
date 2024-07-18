import Router from 'koa-router'
import _ from 'lodash'
import verify from '#middleware/verify.js'
import snsService from '#services/sns.js'

const router = new Router();

router.post('/sns/:type', async ({ models, response }) => {
  const items = await models.Project.getList({});
  response.success({ items });
})

router.get('/sns', verify, async ({ models, params, req, response, state }) => {
  const { User, Sns } = models;
  const where = { user_id: state.user._id };
  const docs = await Sns.getList({ where, lean: true, attrs: { detail: 0 } });
  const map = _.keyBy(docs, 'sns_type');
  const items = [];
  ['alipay', 'github', 'google', 'weibo', 'apple', 'wechat'].forEach(type => {
    items.push(map[type] || { sns_id: '', sns_type: type, status: 0 });
  })
  response.success({ items });
})

router.post('/sns/:type/cancel', verify, async (ctx) => {
  await snsService.cancel(ctx, ctx.params.type);
  ctx.response.success();
})

export default router