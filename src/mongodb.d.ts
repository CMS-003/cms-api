import { Connection } from 'mongoose';
import schema from 'schema'

declare const MODEL: {
  [K in keyof typeof schema]: typeof schema[K] extends new (...args: any[]) => infer Instance ? Instance : never;
};
declare const DBS: {
  [key: string]: Connection
}
export function initMongo(mongo_url: string): void;
export const dbs: DBS;

export default MODEL;