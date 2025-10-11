import { Client } from '@elastic/elasticsearch'
import { pinyin } from 'pinyin'
import _ from 'lodash'

const client = new Client({
  node: 'http://192.168.0.124:9200',
  auth: {
    username: 'elastic',
    password: '123456'
  }
});

function getBaseQuery(options) {
  /**
   * @type any
   */
  const baseQuery = {
    bool: {
      // should: [],
      filter: [
        // {
        //   term: {
        //     available: 1,
        //   },
        // },
      ],
    },
  };
  if (options.q) {
    baseQuery.bool.should = [
      {
        match_phrase: {
          'title.iks': {
            query: options.q,
            boost: 10,
            slop: 2,
          },
        },
      },
      {
        match: {
          'title.fpy': pinyin(options.q.replace(/[<>"/?\\*|':]/g, ''), { style: pinyin.STYLE_NORMAL }).join('')
        }
      },
      {
        match: {
          'content.iks': {
            query: options.q,
            boost: 3,
          }
        }
      }
    ];
  }
  if (options.region) {
    baseQuery.bool.filter.push({ term: { region: options.region } });
  }
  if (options.type) {
    baseQuery.bool.filter.push({ terms: { type: _.isString(options.type) ? options.type.split(',').map(type => parseInt(type)).filter(t => !!t) : [options.type] } })
  }
  if (options.status) {
    baseQuery.bool.filter.push({ term: { status: parseInt(options.status, 10) } })
  }
  if (options.tags) {
    baseQuery.bool.filter.push({ terms: { 'tags': options.tags.split(',') } })
  }
  return baseQuery;
};

export function getQuery(hql) {
  const query = getBaseQuery(hql.where);
  /**
   * @type any
   */
  let sort = hql.where.q ? { _score: { order: 'desc' } } : { createdAt: { order: 'desc' } };
  const min_score = hql.where.q ? 40 : 0;
  if (hql.sort) {
    if (hql.sort.createdAt) {
      sort = { createdAt: { order: hql.sort.createdAt === 1 ? 'asc' : 'desc' } };
    } else if (hql.sort.publishedAt) {
      sort = { publishedAt: { order: hql.sort.publishedAt === 1 ? 'asc' : 'desc' } };
    } else if (hql.sort.updatedAt) {
      sort = { updatedAt: { order: hql.sort.updatedAt === 1 ? 'asc' : 'desc' } };
    }
  }

  const body = {
    size: hql.limit,
    from: hql.limit * (hql.page - 1),
    // _source: FIELDS,
    min_score,
    sort: [
      sort,
    ],
    query,
    highlight: {
      pre_tags: ['<span class="es-highlight">'],
      post_tags: ['</span>'],
      fields: {
        title: { number_of_fragments: 0 }, // 高亮片段
        desc: { number_of_fragments: 1, fragment_size: 100 }, // 文本长度
        content: { number_of_fragments: 5, fragment_size: 300 }, // 文本长度
      },
    },
  };
  return body;
}

export function getES() {
  return client;
}