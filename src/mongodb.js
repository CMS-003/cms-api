import mongoose from 'mongoose';
import Base, { getMongoSchema } from "schema/dist/base.js";
import { MConnection, MJsonSchema } from 'schema';

export const dbs = {};
const models = {};

export function initTable(db, doc) {
  if (db.models[doc.table]) {
    delete db.models[doc.table];
  }
  const CModel = new Base();
  CModel.model = db.model(
    doc.table,
    getMongoSchema(doc.schema, {
      strict: true,
      versionKey: false,
      excludeIndexes: true,
      collection: doc.table,
      timestamps: false,
    }),
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
  schemas.forEach(doc => {
    if (dbs[doc.db]) {
      initTable(dbs[doc.db], doc);
    }
  });
  return
}

export default models;