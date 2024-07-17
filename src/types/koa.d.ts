import { Model, Schema, Document } from 'mongoose';
import models from '../models/index'
import mongoose from 'mongoose';
import Koa, { ParameterizedContext, BaseContext, ExtendableContext } from 'koa'
import Application from 'koa';
import Mailer from '../utils/mailer'
import { Base, OPT, IUser, IConfig } from 'schema/dist/@types/types'
import { MUser } from 'schema'

declare module 'schema' {
  export class MUser extends Base<IUser & { isEqual: (pass: string) => boolean; }> {
    constructor(db: mongoose.Connection, params?: {
      methods?: {
        [key: string]: Function;
      };
      statics?: {
        [key: string]: (this: Model<IUser & { isEqual: (pass: string) => boolean; }>) => any;
      };
    })
  }
}

declare module 'koa' {

  export interface ExtendableContext {
    config: {
      [key: string]: any;
    };
    models: typeof models;
    loadConfig: Function;
    mailer: Mailer
  };

  interface DefaultContext {
    config: {
      [key: string]: any;
    };
    models: typeof models;
    Response: BaseResponse;
    dbs: typeof models.dbs;
    loadConfig: Function;
    mailer: Mailer;
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
