import constant from '../constant.js'
import path from 'path'
import log4js from "log4js"

log4js.configure({
  appenders: {
    access: { type: "dateFile", filename: path.join(constant.PATH.ROOT, "logs/access.log"), keepFileExt: true, fileNameSep: '_', pattern: 'yyyy-MM-dd', alwaysIncludePattern: true },
    log: { type: "dateFile", filename: path.join(constant.PATH.ROOT, "logs/info.log"), keepFileExt: true, fileNameSep: '_', pattern: 'yyyy-MM-dd', alwaysIncludePattern: true },
    print: { type: "console" }
  },
  categories: { default: { appenders: ["print", "log"], level: "info" }, access: { appenders: ["access"], level: "all" } }
});

export default function loggerCreator(name) {
  return log4js.getLogger(name);
};
