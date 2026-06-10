import { v7 } from "uuid";
import Router from 'koa-router'

const route = new Router();

route.post('/', async (ctx) => {
  const { models, request, response } = ctx;
  const data = request.body;
  data._id = v7();
  data.createdAt = new Date();
  data.updatedAt = new Date();
  data.deletedAt = null;
  data.uid = '1';
  data.status = 1;
  await models.MAccount.create(data);
  response.success();
})

export default route;
