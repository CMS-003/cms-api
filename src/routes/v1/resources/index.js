const Router = require('koa-router')
const superagent = require('superagent')

const ResourceRoute = new Router({
    prefix: '',
});

ResourceRoute.get('/', async ({ BLL, state, request, response }) => {
    const resp = await superagent.get(`http://192.168.0.124:8097/v1/public/resources?${request.querystring}`);
    if (resp.statusCode === 200) {
        response.success({ items: resp.body.data })
    } else {
        response.fail()
    }
})


module.exports = ResourceRoute