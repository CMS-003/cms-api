import constant from '../constant.js'
import path from 'path'
import log4js from "log4js"
import config from '../config/index.js'
import { v4 } from 'uuid'
import models from '../mongodb.js'

const mongoModule = {
  configure: (config, layouts, findAppender, levels) => {
    return (event) => {
      const type = event.level.levelStr.toLowerCase();
      const group = event.categoryName;
      const createdAt = event.startTime;
      const content = event.data.join('\n');
      const data = { _id: v4(), type, group, createdAt, content };
      if (models.MLog) {
        models.MLog.create(data).then(() => { });
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
