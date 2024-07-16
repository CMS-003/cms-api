import { Model, Schema, Document } from 'mongoose';
import models from '../models/index'
import mongoose from 'mongoose';
import Koa, { ParameterizedContext, BaseContext, ExtendableContext } from 'koa'
import Application from 'koa';
import { Base, OPT, IUser } from 'schema/dist/@types/types'
import { MUser } from 'schema'

declare module 'schema' {
  export class MUser {
    getInfo(opt: OPT): Promise<IUser & { isEqual: (pass: string) => boolean }>;
  }
}
interface IUser {
  isEqual: (pass: string) => boolean;
}

declare module 'koa' {

  export interface ExtendableContext {
    config: {
      [key: string]: any;
    };
    models: typeof models;
  };
  export interface context {
    config: {
      [key: string]: any;
    };
    models: typeof models;
  }
  interface DefaultContext {
    config: {
      [key: string]: any;
    };
    models: typeof models;
    Response: BaseResponse;
    dbs: typeof models.dbs;
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
