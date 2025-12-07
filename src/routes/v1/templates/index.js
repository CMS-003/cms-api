import Router from 'koa-router'
import _ from 'lodash'
import { v4 } from 'uuid'
import verify from '#middleware/verify.js'
import { getComponentTreeInfo } from '#services/component.js'
import { getRedis } from '#utils/redis.js';
import { ComponentNode } from '../../../protos/component.js'
export function jsonToValue(input) {
  if (input === null) {
    return {
      kind: {
        oneofKind: "nullValue",
        nullValue: true
      }
    };
  }

  if (Array.isArray(input)) {
    return {
      kind: {
        oneofKind: "arrayValue",
        arrayValue: {
          values: input.map(jsonToValue)
        }
      }
    };
  }

  switch (typeof input) {
    case "string":
      return {
        kind: {
          oneofKind: "stringValue",
          stringValue: input
        }
      };

    case "number":
      return {
        kind: {
          oneofKind: "numberValue",
          numberValue: input
        }
      };

    case "boolean":
      return {
        kind: {
          oneofKind: "boolValue",
          boolValue: input
        }
      };

    case "object":
      return {
        kind: {
          oneofKind: "objectValue",
          objectValue: {
            fields: Object.fromEntries(
              Object.entries(input).map(([k, v]) => [k, jsonToValue(v)])
            )
          }
        }
      };
  }

  throw new Error("Unsupported JSON type");
}
function fillDefaults(node) {
  return {
    id: node.id || "",
    type: node.type || "",
    template_id: node.template_id || "",
    project_id: node.project_id || "",
    parent_id: node.parent_id || "",
    tree_id: node.tree_id || "",
    title: node.title || "",
    name: node.name || "",
    icon: node.icon || "",
    cover: node.cover || "",
    desc: node.desc || "",
    order: node.order ?? 1,
    status: node.status ?? 1,
    createdAt: new Date(node.createdAt).toISOString(),
    updatedAt: new Date(node.updatedAt).toISOString(),
    style: jsonToValue(node.style || {}), // ✅ object 默认 {}
    attrs: jsonToValue(node.attrs || {}), // ✅ object 默认 {}
    // widget: fillWidget(node.widget || {}),
    widget: node.widget,
    accepts: node.accepts || [],
    url: node.url || "",
    resources: node.resources?.map(fillResource) || [],
    queries: node.queries || [],
    children: node.children?.map(fillDefaults) || [],
  };
}

function fillKvPair(kv) {
  return { label: kv.label || "", value: kv.value || "" };
}

function fillWidget(w) {
  return {
    field: w.field || "",
    value: w.value ?? "",
    type: w.type || "",
    query: w.query ?? false,
    source: w.source || "",
    refer: w.refer?.map(fillKvPair) || [],
    action: w.action || "",
    method: w.method || "",
  };
}

function fillResource(r) {
  return {
    id: r.id || "",
    title: r.title || "",
    cover: r.cover || "",
    poster: r.poster || "",
    thumbnail: r.thumbnail || "",
    status: r.status ?? 0,
  };
}

const router = new Router();

router.get('/', verify, async ({ models, request, state, response }) => {
  const hql = request.paginate()
  if (request.query.type) {
    hql.where.type = request.query.type;
  }
  if (request.query.project_id) {
    hql.where.project_id = request.query.project_id
  }
  hql.sort = { updatedAt: -1 }
  const items = await models.MTemplate.getAll(hql);
  response.success({ items })
})

router.post('/', verify, async ({ models, state, request, response }) => {
  request.body._id = v4()
  // request.body.project_id = state.project_id
  request.body.createdAt = new Date();
  request.body.updatedAt = new Date();
  if (!request.body.attrs) {
    request.body.attrs = {};
  }
  await models.MTemplate.create(request.body)
  response.success()
})

router.put('/:template_id', verify, async ({ models, params, request, response }) => {
  request.body.updatedAt = new Date();
  await models.MTemplate.update({ where: { _id: params.template_id }, data: { $set: request.body } })
  response.success()
})

router.del('/:template_id', verify, async ({ models, params, request, response }) => {
  const tree_ids = await models.MComponent.aggregate([
    { $match: { template_id: params.template_id } },
    { $group: { _id: "$tree_id" } }
  ]);
  await models.MComponent.destroy({ where: { template_id: params.template_id } })
  await models.MTemplate.destroy({ where: { _id: params.template_id } })
  const redis = getRedis();
  if (redis && tree_ids.length) {
    await redis.del(tree_ids.map(v => `api:v1:component_module:${v._id}:detail`))
  }
  response.success()
})

router.get('/:template_id/fields', verify, async ({ models, params, request, response }) => {
  const hql = { where: { _id: params.template_id }, lean: true }
  const item = await models.MTemplate.getInfo(hql);
  response.success({ items: item ? (item.fields || []) : [] })
})

router.get('/:id/components', async ({ params, request, models, response }) => {
  const hql = request.paginate();
  const template = await models.MTemplate.getInfo({ where: { $or: [{ _id: params.id }, { name: params.id }] }, lean: true });
  if (!template) {
    return response.throwBiz('COMMON.NotFound')
  }
  hql.where = { template_id: template._id, parent_id: '' };
  hql.lean = true;
  hql.sort = { order: 1 }
  const docs = await models.MComponent.getList(hql);
  const items = [];
  for (let i = 0; i < docs.length; i++) {
    const tree = await getComponentTreeInfo(docs[i]._id);
    if (tree) {
      items.push(tree)
    }
  }
  // @ts-ignore
  template.children = items;
  if (request.get('x-proto')) {
    response.set('x-proto', 'component')
    const binary = ComponentNode.toBinary(fillDefaults(template))
    // 转换为 ArrayBuffer
    const arrayBuffer = binary.buffer.slice(
      binary.byteOffset,
      binary.byteOffset + binary.byteLength
    );
    response.set('Content-Type', 'application/octet-stream');
    response.body = Buffer.from(arrayBuffer);
  } else {
    response.success(template);
  }
})

router.get('/:id/components-proto', async ({ params, request, models, response }) => {
  const hql = request.paginate();
  const template = await models.MTemplate.getInfo({ where: { $or: [{ _id: params.id }, { name: params.id }] }, lean: true });
  if (!template) {
    return response.throwBiz('COMMON.NotFound')
  }
  hql.where = { template_id: template._id, parent_id: '' };
  hql.lean = true;
  hql.sort = { order: 1 }
  const docs = await models.MComponent.getList(hql);
  const items = [];
  for (let i = 0; i < docs.length; i++) {
    const tree = await getComponentTreeInfo(docs[i]._id);
    if (tree) {
      items.push(tree)
    }
  }
  // @ts-ignore
  template.children = items;

  const binary = ComponentNode.toBinary(fillDefaults(template))
  // 转换为 ArrayBuffer
  const arrayBuffer = binary.buffer.slice(
    binary.byteOffset,
    binary.byteOffset + binary.byteLength
  );

  response.set('Content-Type', 'application/octet-stream');
  response.body = Buffer.from(arrayBuffer);
})

export default router