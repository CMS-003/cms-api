import { Model, Schema, Document, Connection } from 'mongoose';
import mongoose from 'mongoose';
import Koa, { ParameterizedContext, BaseContext, ExtendableContext } from 'koa'
import Application from 'koa';
import Mailer from '../utils/mailer'
import Scheduler from '../utils/scheduler';
import * as schema from './model.d.ts'
import { OPT } from 'schema/dist/@types';
import { createClient } from 'redis'
import constant from '../constant.js';

type dbs = { [key: string]: Connection };
type models = {
  [K in keyof typeof schema]: typeof schema[K] extends new (...args: any[]) => infer Instance ? Instance : never;
};
declare module 'koa' {
  declare const MODEL: {
    [K in keyof typeof schema]: typeof schema[K] extends new (...args: any[]) => infer Instance ? Instance : never;
  };
  declare const DBS: {
    [key: string]: Connection
  }
  export interface ExtendableContext {
    consts: typeof constant;
    config: {
      [key: string]: any;
    };
    dbs: dbs;
    models: models;
    redis: ReturnType<createClient>;
    loadConfig: Function;
    mailer: Mailer;
    scheduler: Scheduler;
    getResourceByCache: (_id: string, all?: boolean) => any;
  };

  interface DefaultContext {
    consts: typeof constant;
    config: {
      [key: string]: any;
    };
    dbs: DBS;
    models: MODEL;
    redis: ReturnType<createClient>;
    Response: BaseResponse;
    loadConfig: Function;
    mailer: Mailer;
    scheduler: Scheduler;
  }

  interface BaseRequest {
    paginate: (fn?: (hql: OPT) => void) => OPT;
  }

  interface BaseResponse {
    success: (params?: { items?: Object[], item?: Object, count?: number } & any, extra?: { code?: number, message?: string }) => void;
    fail: (params?: { code?: number, message?: string, status?: number, data?: any }) => void;
    throwBiz: Function;
  }

}
