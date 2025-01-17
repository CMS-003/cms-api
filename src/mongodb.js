import mongoose from 'mongoose';
import Base, { getMongoSchema } from "schema/dist/base.js";
import { MConnection, MJsonSchema } from 'schema';

export const dbs = {};
const models = {};

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
  schemas.forEach(schema => {
    if (dbs[schema.db]) {
      const CModel = new Base();
      CModel.model = dbs[schema.db].model(
        schema.table,
        getMongoSchema(schema.schema, {
          strict: true,
          versionKey: false,
          excludeIndexes: true,
          collection: schema.table,
          timestamps: false,
        }),
      );
      models[schema.name] = CModel;
    }
  });
  return
}

export default models;