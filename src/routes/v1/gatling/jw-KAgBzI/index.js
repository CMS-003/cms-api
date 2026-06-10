import Router from 'koa-router'
import { v7 } from 'uuid';
import { verifyToken } from '#services/user.js';

const route = new Router();

route.post('/', async (ctx) => {
  const { models, request, response } = ctx;
  const user = await verifyToken(ctx.get('authorization'));
  const result = await models.MStar.create({
    _id: v7(),
    uid: user.id,
    rid: request.body.resource_id,
    type: request.body.resource_type,
    title: request.body.title,
    cover: request.body.cover,
    createdAt: new Date(),
  });
  response.success();
})

export default route;
