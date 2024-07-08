import constant from '../constant.js'
import path from 'path'
import log4js from "log4js"
import mongoose from 'mongoose'
import dayjs from 'dayjs'
import config from '../config/index.js'
import { v4 } from 'uuid'

const mongoModule = {
  configure: (config, layouts, findAppender, levels) => {
    const schema = new mongoose.Schema({
      _id: {
        type: String, // 唯一名称
        default: v4,
      },
      // log,info,error,
      type: {
        type: String,
      },
      group: {
        type: String,
      },
      content: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: () => dayjs().toDate(),
      },
    }, {
      strict: false,
      collection: 'log_info',
    });
    let model = null;
    const db = mongoose.createConnection(config.mongo_url)
    db.on('connected', function () {
      model = db.model('Log', schema);
    });
    db.on('error', err => {
      console.log(err);
    })
    return (event) => {
      const type = event.level.levelStr.toLowerCase();
      const group = event.categoryName;
      const createdAt = event.startTime;
      const content = event.data.join('\n');
      const data = { type, group, createdAt, content };
      if (model) {
        model.create(data).then(() => { });
      }
    }
  },
};
log4js.configure({
  appenders: {
    access: { type: "dateFile", filename: path.join(constant.PATH.ROOT, "logs/access.log"), keepFileExt: true, fileNameSep: '_', pattern: 'yyyy-MM-dd', alwaysIncludePattern: true },
    log: { type: "dateFile", filename: path.join(constant.PATH.ROOT, "logs/info.log"), keepFileExt: true, fileNameSep: '_', pattern: 'yyyy-MM-dd', alwaysIncludePattern: true },
    print: { type: "console" },
    mongo: {
      type: mongoModule,
      mongo_url: config.mongo_url,
    }
  },
  categories: { default: { appenders: ["print", "log", "mongo"], level: "info" }, access: { appenders: ["access", "mongo"], level: "all" } }
});

export default function loggerCreator(name) {
  return log4js.getLogger(name);
};
