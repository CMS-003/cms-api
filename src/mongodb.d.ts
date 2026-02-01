import { Connection } from 'mongoose';
import * as schema from '#@types/model.d.ts'
import { IJsonSchema } from '#@types/document';
import { OPT } from 'schema/dist/@types';

export interface XPT extends OPT {
  model: schema;
  types: string[];
  key: string;
};

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