import { Model, Schema, Document, Connection } from 'mongoose';
import getModels from '../models/index'
import mongoose from 'mongoose';
import Koa, { ParameterizedContext, BaseContext, ExtendableContext } from 'koa'
import Application from 'koa';
import Mailer from '../utils/mailer'
import Scheduler from '../utils/scheduler';
import schema from 'schema'

type dbs = { [key: string]: Connection };
type models = {
  [K in keyof typeof schema]: typeof schema[K] extends new (...args: any[]) => infer Instance ? Instance : never;
};
declare module 'koa' {
  declare const MODEL: {
    [K in keyof typeof schema]: typeof schema[K] extends new (...args: any[]) => infer Instance ? Instance : never;
  };
  export interface ExtendableContext {
    config: {
      [key: string]: any;
    };
    dbs: dbs;
    models: models;
    loadConfig: Function;
    mailer: Mailer;
    scheduler: Scheduler;
  };

  interface DefaultContext {
    config: {
      [key: string]: any;
    };
    models: MODEL;
    Response: BaseResponse;
    dbs: dbs;
    loadConfig: Function;
    mailer: Mailer;
    scheduler: Scheduler;
  }

  interface BaseRequest {
    paging: () => OPT;
  }

  interface BaseResponse {
    success: (params?: { items?: Object[], item?: Object, count?: number } & any, extra?: { message?: string }) => void;
    fail: (params?: { code?: number, message?: string, status?: number }) => void;
    throwBiz: Function;
  }

}
