import { Model, Schema, Document } from 'mongoose';
import models from '../models/index'
import mongoose from 'mongoose';

interface OPT {
  where?: { [key: string]: any },
  sort?: { [key: string]: any } | string,
  attrs?: { [key: string]: number },
  lean?: boolean,
  data?: any,
  options?: object,
  page?: number,
  offset?: number,
  limit?: number,
}
interface BaseModel {
  model: Model<Document>,
  _init: (opt: any) => OPT;
  query: (sql) => any;
  aggregate: (query: any) => any;
  getModel: () => Model;
  destroy: (opt: OPT) => void;
  update: (opt: OPT) => void;
  getAll: (opt: OPT) => Model[];
  count: (opt: OPT) => number;
  getList: (opt: OPT) => Model[];
  getInfo: (opt: OPT) => Model;
  create: (data: any) => Document;
}

declare module 'koa' {

  interface DefaultContext {
    config: {
      [key: string]: any;
    };
    models: {
      [k in keyof models]: BaseModel;
    };
    Response: Response;
  }

  interface BaseRequest {
    paging: () => OPT;
  }

  interface BaseResponse {
    success: (params?: { items?: Object[], item?: Object, count?: number } & any) => void;
    fail: Function;
    throwBiz: Function;
  }

  interface ExtendableContext {
    config: {
      [key: string]: any;
    };
    models: {
      [k in keyof models]: BaseModel;
    };
  }
}
