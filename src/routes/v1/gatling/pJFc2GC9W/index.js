import Router from 'koa-router'
import { verifyToken } from '#services/user.js';

const route = new Router();

route.post('/', async (ctx) => {
  const { models, request, response } = ctx;
  const user = await verifyToken(ctx.get('authorization'));
  await models.MStar.destroy({
    where: { uid: user.id, rid: request.body.resource_id }
  });
  response.success();
})

export default route;
