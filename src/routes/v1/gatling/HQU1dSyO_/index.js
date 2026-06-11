import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { Client } from '@elastic/elasticsearch'
import * as cheerio from 'cheerio'
import Router from 'koa-router'
import define from 'define'

const index = 'cms';
function doc2doc(doc, constant) {
  const $ = cheerio.load(doc.content || '', { decodeEntities: false });
  const content = $.text().substr(0, 300);
  return {
    region: doc.country || '',
    lang: doc.lang || '',
    title: doc.title || '',
    series: doc.series || '',
    type: doc.type,
    origin: doc.origin,
    status: doc.status || 1,
    types: doc.types || [],
    desc: doc.desc,
    content: content,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt || doc.createdAt),
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt) : null,
    size: parseFloat(doc.size) || 0,
    tags: doc.tags || [],
    actors: doc.actors || [],
    uid: doc.uid || '',
    uname: doc.uname || '',
  }
}
const client = new Client({
  node: 'http://192.168.0.124:9200',
  auth: {
    username: 'elastic',
    password: '123456'
  }
});

const route = new Router();

route.post('/', async (ctx) => {
  const { models, query, response } = ctx;
  const _id = query.id;
  const doc = await models.MResource.getInfo({ where: { _id }, lean: true })
  if (!doc) {
    return response.fail();
  }
  await client.index({ index, id: _id, body: doc2doc(doc, define) })
  response.success();
})

export default route;
