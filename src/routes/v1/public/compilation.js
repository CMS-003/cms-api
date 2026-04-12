import Router from 'koa-router'
import _ from 'lodash'
import { getResourceInfo } from '#services/resource.js';

const route = new Router();

route.get('/compilations', async ({ state, request, models, response }) => {
  try {
    const { MCompilation } = models;
    const query = request.paginate(hql => {
      hql.sort = { createdAt: -1 };
      hql.attrs = { res_ids: 0 };
      hql.lean = true;
      return hql;
    });
    const list = await MCompilation.getList(query);
    const arr = list.length ? await MCompilation.aggregate([
      { $match: { _id: { $in: list.map(v => v._id) } } },
      {
        $addFields: {
          ids: { $size: { $ifNull: ["$res_ids", []] } }  // 处理空数组
        }
      },
      { $group: { _id: '$_id', total: { $sum: '$ids' } } }
    ]) : [];
    const o = _.keyBy(arr, '_id')
    list.forEach(compilation => {
      // @ts-ignore
      compilation.total = o[compilation._id] ? o[compilation._id].total : 0;
    })
    response.success({ items: list });
  } catch (e) {
    response.fail()
  }
})

route.get('/compilations/:_id', async ({ request, params, models, response }) => {
  const doc = await models.MCompilation.getInfo({
    where: { _id: params._id },
    lean: true,
  });
  if (doc) {
    // @ts-ignore
    doc.total = doc.res_ids.length;
    delete doc.res_ids;
    response.success({ item: doc })
  } else {
    response.fail()
  }
})

route.get('/compilations/:_id/resources', async ({ state, request, params, models, response }) => {
  try {
    const query = request.paginate();
    const { MCompilation } = models;
    const docs = await MCompilation.aggregate([
      { $match: { _id: params._id } },
      {
        $unwind: {
          path: "$res_ids",
          includeArrayIndex: "index"  // 保留数组索引
        }
      },
      {
        $match: {
          index: { $gte: (query.page - 1) * query.limit, $lt: query.page * query.limit }
        }
      }
    ]);
    const list = await Promise.all(docs.map(doc => getResourceInfo({ res_id: doc.res_ids }, '')));
    response.success({ items: list });
  } catch (e) {
    response.fail()
  }
})

export default route