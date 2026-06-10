import Router from 'koa-router'
import { verifyToken } from '#services/user.js';
import { getResourceInfo } from '#services/resource.js';

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  let user_id = '';
  try {
    const user = await verifyToken(ctx.get('authorization'));
    if (user) {
      user_id = user.id;
    }
  } catch (e) {
    console.log(e.message)
  }
  console.log(request.get('x-project-id'), user_id)
  const Resource = request.get('x-project-id') === 'hentai' ? models.MResource : models.MResourceDemo;
  const arr = await Resource.aggregate([
    { $match: { type: 2 } },
    { $sample: { size: 20 } },
  ]);
  const items = [];
  for (let i = 0; i < arr.length; i++) {
    const doc = await getResourceInfo({ res_id: arr[i]._id }, user_id, true);
    console.log(doc)
    if (doc) {
      items.push(doc);
    }
  }
  response.success({ items });
})

export default route;
