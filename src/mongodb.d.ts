import { Connection } from 'mongoose';
import schema from '#@types/model'
import { IJsonSchema } from '#@types/document';

declare const MODEL: {
  [K in keyof typeof schema]: typeof schema[K] extends new (...args: any[]) => infer Instance ? Instance : never;
};
declare const DBS: {
  [key: string]: Connection
}

export const dbs: DBS;
export async function initTable(db: Connection, schema: IJsonSchema): void;
export async function initMongo(mongo_url: string): Promise<void>;

export default MODEL;