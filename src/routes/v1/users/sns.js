const Router = require('koa-router')
const _ = require('lodash');
const userVerify = require('../../../middleware/user_verify')
const snsService = require('../../../services/sns.js')

const router = new Router();

router.post('/sns/:type', async ({ BLL, response }) => {
  const items = await BLL.projectBLL.getList({});
  response.success({ items });
})

router.get('/sns', userVerify, async ({ BLL, params, req, response, state }) => {
  const { userBLL, snsBLL } = BLL;
  const where = { user_id: state.user._id };
  const docs = await snsBLL.getList({ where, lean: true, attrs: { detail: 0 } });
  const map = _.keyBy(docs, 'sns_type');
  const items = [];
  ['alipay', 'github', 'google', 'weibo', 'apple', 'wechat'].forEach(type => {
    items.push(map[type] || { sns_id: '', sns_type: type, status: 0 });
  })
  response.success({ items });
})

router.post('/sns/:type/cancel',userVerify, async (ctx) => {
  await snsService.cancel(ctx, ctx.params.type);
  ctx.response.success();
})

module.exports = router