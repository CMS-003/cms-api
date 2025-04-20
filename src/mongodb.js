import mongoose from 'mongoose';
import Base, { getMongoSchema } from "schema/dist/base.js";
import { MConnection, MJsonSchema } from 'schema';
import { VMScript, NodeVM } from 'vm2';
import constant from '#constant.js';
import { pathToFileURL } from 'node:url';

export const dbs = {};
const models = {};

export function initTable(db, doc) {
  if (db.models[doc.table]) {
    delete db.models[doc.table];
  }
  const CModel = new Base();
  const schema = getMongoSchema(doc.schema, {
    strict: true,
    versionKey: false,
    excludeIndexes: true,
    collection: doc.table,
    timestamps: false,
  });
  doc.methods.forEach(v => {
    const { name, script } = v;
    const code = new VMScript(script).compile();
    const fn = new NodeVM({
      console: 'inherit',
      sandbox: {
        process: {
          env: process.env,
        },
      },
      require: {
        external: true,
        root: constant.PATH.ROOT,
        builtin: ['*']
      }
    }).run(code, {});
    if (v.group === 1) {
      schema.method(name, fn);
    }
  })

  CModel.model = db.model(
    doc.table,
    schema,
  );
  models[doc.name] = CModel;
}

export async function initMongo(mongo_url) {
  const system = mongoose.createConnection(mongo_url);
  const Connection = new MConnection(system);
  const JsonSchema = new MJsonSchema(system);
  models.MJsonSchema = JsonSchema;
  const connections = await Connection.getAll({ where: { status: 1 }, lean: true });
  dbs.system = system;
  connections.forEach(connection => {
    dbs[connection._id] = mongoose.createConnection(mongo_url.replace('schema', connection._id));
  });
  const schemas = await JsonSchema.getAll({ where: { status: 1 }, lean: true })
  if (process.env.NODE_ENV === 'development') {
    // 自动生成声明文件
    const { initTypes } = await import(pathToFileURL(constant.PATH.ROOT + '/bin/init-types.js'))
    initTypes(schemas);
  }
  schemas.forEach(doc => {
    if (dbs[doc.db]) {
      initTable(dbs[doc.db], doc);
    }
  });
  return
}

export default models;