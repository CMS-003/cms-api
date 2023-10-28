const Router = require('koa-router')
const superagent = require('superagent')
const config = require('../../../config')

const ResourceRoute = new Router({
    prefix: '',
});

ResourceRoute.get('/', async ({ BLL, state, request, response }) => {
    const resp = await superagent.get(`${config.resource_api_prefix}/v1/public/resources?${request.querystring}`);
    if (resp.statusCode === 200) {
        response.success({ items: resp.body.data })
    } else {
        response.fail()
    }
})


module.exports = ResourceRoute