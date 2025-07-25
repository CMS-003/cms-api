import Router from 'koa-router'
import verify from '#middleware/verify.js'

const router = new Router();

router.get('/menu', verify, async ({ models, params, req, response }) => {
  const { MComponent } = models;
  const where = { tree_id: 'bc2753d5-2af0-4bba-8eef-b2b5cdba2caf' };
  const items = await MComponent.getList({ where, sort: 'order', lean: true });
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

export default router