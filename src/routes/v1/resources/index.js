import Router from 'koa-router'
import superagent from 'superagent'
import config from '#config/index.js'

const ResourceRoute = new Router({
  prefix: '',
});

ResourceRoute.get('/', async ({ models, state, request, response }) => {
  const resp = await superagent.get(`${config.resource_api_prefix}/admin/v1/public/resources?${request.querystring}`);
  if (resp.statusCode === 200) {
    response.success({ items: resp.body.data })
  } else {
    response.fail()
  }
})


export default ResourceRoute