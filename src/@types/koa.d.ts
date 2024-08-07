import { Model, Schema, Document, Connection } from 'mongoose';
import getModels from '../models/index'
import mongoose from 'mongoose';
import Koa, { ParameterizedContext, BaseContext, ExtendableContext } from 'koa'
import Application from 'koa';
import Mailer from '../utils/mailer'
import Scheduler from '../utils/scheduler';

type dbs = { [key: string]: Connection };
type models = { [key: string]: Model }
declare module 'koa' {

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
    models: Partial<models>;
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
