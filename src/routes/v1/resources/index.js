import Router from 'koa-router'
import config from '#config/index.js'
import got from 'got'

const ResourceRoute = new Router({
  prefix: '',
});

ResourceRoute.get('/', async ({ models, state, request, response }) => {
  try {
    const resp = await got.get(`${config.resource_api_prefix}/admin/v1/public/resources?${request.querystring}`, { responseType: 'json' })
    if (resp.statusCode === 200) {
      response.success({ items: resp.body.data })
    } else {
      response.fail();
    }
  } catch (e) {
    response.fail()
  }
})


export default ResourceRoute