import Router from 'koa-router'
import _ from 'lodash'


const route = new Router();

route.get('/:name', async ({ params, response, models }) => {
  let name = params.name.toLowerCase()
  name = name[0].toUpperCase() + name.substring(1);
  console.log(models[name], name)
  const fields = models[name].getAttributes();
  response.success(fields);
});

export default route