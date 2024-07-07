import _ from 'lodash'
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path'
import loader from './loader.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BizError extends Error {
  constructor(name, params = {}) {
    super();
    this.bizName = name;
    this.params = params;
  }
}

/**
 * 根据业务错误对象生成返回的包装格式
 * @param {Object} bizError 业务错误对象
 * @param {String} lang 语言.默认zh-CN
 * @returns 
 */
function genByBiz(bizError, lang = 'zh-CN') {
  const lib = libs[lang] ? libs[lang] : libs['zh-CN'];
  const result = _.get(lib, bizError.bizName, { status: 200, code: -1, message: 'unknow' });
  let message = result.message;
  if (bizError.params) {
    const keys = Object.keys(bizError.params);
    keys.forEach(key => {
      message = _.replace(message, `{${key}}`, bizError.params[key])
    })
  }
  return {
    status: result.status,
    data: {
      code: result.code,
      message: message,
    }
  }
}

// 业务错误语音包
const libs = {};
loader({ dir: path.join(__dirname, '../config/error-codes') }, (info) => {
  if (info.ext === '') {
    const lang = info.filename
    const lib = {};
    const fullpath = path.normalize(path.join(info.dir, info.filename));
    loader({ dir: fullpath }, (detail) => {
      if (detail.ext) {
        const name = detail.filename.toUpperCase();
        import(pathToFileURL(detail.fullpath)).then(data => {
          lib[name] = data;
        })
      }
    });
    libs[lang] = lib;
  }
})

export {
  BizError,
  genByBiz,
  libs,
}