import verify from '#middleware/verify.js';
import Router from 'koa-router'
import _ from 'lodash'

const route = new Router();

route.get('/timeline', verify, async ({ request, params, models, state, response }) => {
  const followees = await models.MFollow.getAll({ where: { follower_id: state.user.id }, lean: true });
  const uids = followees.map(v => v.followee_id);
  const query = request.paginate((hql) => {
    hql.where = {
      $or: [
        { uid: { $in: uids } },
        { 'actors._id': { $in: uids } },
      ]
    };
    hql.sort = { updatedAt: -1 }
  });
  const items = await models.MResource.getList(query);
  response.success({ items })
})

export default route