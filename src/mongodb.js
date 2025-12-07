import mongoose from 'mongoose';
import { Base, getMongoSchema, MConnection, MJsonSchema } from "schema";
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
  const system = mongoose.createConnection(mongo_url.replace(constant.SYSTEM.MONGO_HOLDER, 'schema'), {
    // 重试相关配置
    serverSelectionTimeoutMS: 10000,     // 10秒服务器选择超时
    socketTimeoutMS: 60000,              // 60秒socket超时
    maxPoolSize: 20,                     // 最大连接数
    minPoolSize: 5,                      // 最小连接数
    retryWrites: true,                   // 启用重试写入
    retryReads: true,                    // 启用重试读取
  });
  const Connection = new MConnection(system);
  const JsonSchema = new MJsonSchema(system);
  models.MJsonSchema = JsonSchema;
  const connections = await Connection.getAll({ where: { status: 1 }, lean: true });
  dbs.system = system;
  connections.forEach(connection => {
    dbs[connection._id] = mongoose.createConnection(mongo_url.replace(constant.SYSTEM.MONGO_HOLDER, connection._id), {
      // 重试相关配置
      serverSelectionTimeoutMS: 10000,     // 10秒服务器选择超时
      socketTimeoutMS: 60000,              // 60秒socket超时
      maxPoolSize: 20,                     // 最大连接数
      minPoolSize: 5,                      // 最小连接数
      retryWrites: true,                   // 启用重试写入
      retryReads: true,                    // 启用重试读取
    });
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