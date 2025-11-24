import Router from 'koa-router'
import _ from 'lodash'
import { getES, getQuery } from '#utils/es.js'
import { getResourceInfo } from '#services/resource.js';

const route = new Router();

route.get('/search', async ({ request, query, models, state, response }) => {
  let pairs = [];
  let total = 0;
  const hql = request.paginate((o) => {
    if (!o.sort) {
      o.sort = { updatedAt: -1 }
    } else {
      const key = query.sort.toString().replace('-', '')
      o.sort = { [key]: query.sort[0] === '-' ? -1 : 1 }
    }
    if (query.type) {
      o.where.type = parseInt(query.type.toString());
    }
    if (query.q) {
      o.where.q = query.q;
    }
    if (query.origin) {
      o.where.origin = query.origin;
    }
    if (query.region) {
      o.where.region = query.region;
    }
    if (query.status) {
      o.where.status = parseInt(query.status.toString());
    }
    return o;
  })
  const client = getES();
  const sql = getQuery(hql)
  /**
   * @typedef {import('#@types/document.js').IResource} IResource
   */

  /**
   * @type {import('@elastic/elasticsearch').estypes.SearchResponse<IResource, Record<string, import('@elastic/elasticsearch').estypes.AggregationsAggregate>>}
   */
  const result = await client.search(sql);
  // @ts-ignore
  total = result.hits.total.value;
  pairs = result.hits.hits.map(hit => ({ res_id: hit._id, res_type: hit._source.type }))
  const items = [];
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i].res_type === 13) {
      items.push(result.hits.hits[i]._source)
    } else {
      const item = await getResourceInfo(pairs[i], '', false);
      items.push(item);
    }
  }
  response.success({ total, items })
})

export default route