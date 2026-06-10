import _ from 'lodash'
import dayjs from 'dayjs'
import Router from 'koa-router'

const route = new Router();

route.post('/', async (ctx) => {
  const { models, request, response } = ctx;
  const data = _.pick(request.body, ['name', 'receiver', 'desc', 'content', 'createdAt', 'expiredAt']);
  data.createdAt = new Date();
  if (dayjs(data.expiredAt).isBefore(data.createdAt)) {
    return response.fail({ message: '打开时间不能是过去的时间' })
  }
  const item = await models.MCapsule.create(data);
  response.success({ id: item._id });
})

export default route;
