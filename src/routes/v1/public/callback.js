import Router from 'koa-router'
import _ from 'lodash'
import Logger from '#utils/logger.js'

const route = new Router();
const logger = Logger('callback')

route.all('/callback/:name', async ({ request, params, models, response }) => {
  logger.info(JSON.stringify({
    name: params.name,
    method: request.method,
    query: request.query,
    body: request.body,
    header: request.header,
  }));
  response.success({})
})
route.allowedMethods();
export default route