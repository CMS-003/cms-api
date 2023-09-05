const Router = require('koa-router')
const userVerify = require('../../../middleware/user_verify')

const UserRoute = new Router();

UserRoute.post('/sign-out', async ({ BLL, response }) => {
  const items = await BLL.projectBLL.getList({});
  response.success({ items });
})

UserRoute.get('/self', userVerify, async ({ params, req, response }) => {
  const { projectBLL } = ctx.BLL;
  const where = { _id: params._id };
  const item = await projectBLL.getInfo({ where });
  response.success({ item });
})

UserRoute.get('/profile', userVerify, async ({ BLL, params, req, response, state }) => {
  const { userBLL } = BLL;
  const where = { _id: state.user._id };
  const item = await userBLL.getInfo({ where, lean: true, attrs: { salt: 0, pass: 0 } });
  response.success({ item });
})

UserRoute.get('/menu', userVerify, async ({ BLL, params, req, response }) => {
  const { componentBLL } = BLL;
  const where = { tree_id: 'bc2753d5-2af0-4bba-8eef-b2b5cdba2caf' };
  const items = await componentBLL.getList({ where, order: 'order', lean: true });
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.children = [];
    items[i].children = [];
    for (let j = 0; j < items.length; j++) {
      if (j !== i) {
        if (items[j].parent_id === item._id) {
          item.children.push(items[j]);
        }
      }
    }
  }
  const tree = items.find(item => item.parent_id === '');
  response.success(tree);
})

module.exports = UserRoute