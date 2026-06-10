import Router from 'koa-router'

const route = new Router();

route.post('/', async (ctx) => {
 const { models, request, response } = ctx;
  const _id =  request.query.id;
  const result = await models.MAccount.getInfo({where:{ _id }, lean: true });
  if (!result) {
    return response.fail();
  }
  const data = {
    password: result.password.map(v=>{v.status=0;return v;})
  }
  data.password.push({
    pass: request.body.pass,
    time: Date.now(),
    status: 1,
  });
  await models.MAccount.update({where:{_id},data:{$set: data }});
  response.success();
})

export default route;
