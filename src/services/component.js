import { getRedis } from '#utils/redis.js';
import _ from 'lodash'
import models from '../mongodb.js';

export async function getTree(tree_id) {
  const items = await models.MComponent.getAll({ where: { tree_id }, sort: { order: 1 }, lean: true })
  items.forEach(v => v.children = []);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    for (let j = 0; j < items.length; j++) {
      if (j !== i) {
        if (items[j].parent_id === item._id) {
          item.children.push(items[j]);
        }
      }
    }
  }
  const tree = items.find(item => item.parent_id === '');
  return tree;
}

export function collectionResourceID(tree) {
  const ids = [];
  if (_.isArray(tree.resources)) {
    tree.resources.map(v => {
      v._id && ids.push(v._id)
    })
  }
  if (_.isArray(tree.children)) {
    for (let i = 0; i < tree.children.length; i++) {
      const results = collectionResourceID(tree.children[i]);
      ids.push(...results)
    }
  }
  return ids;
}

export function fillResources(tree, map) {
  if (_.isArray(tree.resources)) {
    tree.resources = tree.resources.map(v => map[v._id] || v);
  }
  if (_.isArray(tree.children)) {
    tree.children.forEach(child => {
      fillResources(child, map);
    })
  }
}

/**
 * 获取(缓存)组件详情
 * @param {string} _id 组件id
 * @returns 
 */
export async function getComponentInfo(_id) {
  const redis = getRedis();
  let doc = null;
  const key = `api:v1:component:${_id}:detail`
  if (redis) {
    const str = await redis.get(key);
    try {
      doc = JSON.parse(str);
      return doc;
    } catch (e) {
      console.log(e);
    }
  }
  doc = await models.MComponent.getInfo({ where: { _id }, lean: true })
  if (doc) {
    await redis.set(key, JSON.stringify(doc));
    await redis.expire(key, 60 * 60 * 6)
  }
  return doc;
}

/**
 * 获取(缓存)组件构成的模块详情
 * @param {string} _id 
 * @returns 
 */
export async function getComponentTreeInfo(_id) {
  const redis = getRedis();
  let doc = null;
  const key = `api:v1:component_module:${_id}:detail`
  if (redis) {
    const str = await redis.get(key);
    try {
      if (str) {
        doc = JSON.parse(str);
        return doc;
      }
    } catch (e) {
      console.log(e);
    }
  }
  doc = await getTree(_id)
  if (redis && doc) {
    await redis.set(key, JSON.stringify(doc));
    await redis.expire(key, 60 * 60 * 6)
  }
  return doc;
}

export async function remCacheByIDs(ids) {
  const redis = getRedis()
  const tree_ids = (await models.MComponent.model.aggregate([
    { $match: { _id: { $in: ids } } },
    { $group: { _id: "$tree_id" } }
  ]));
  if (ids.length) {
    let multi = redis.multi();
    tree_ids.forEach(v => {
      multi.del(`api:v1:component_module:${v._id}:detail`)
    });
    await multi.exec();
  }
}