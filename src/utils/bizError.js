const _ = require('lodash');
const path = require('path');
const loader = require('./loader');

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
  const package = packages[lang] ? packages[lang] : packages['zh-CN'];
  const result = _.get(package, bizError.bizName, { status: 200, code: -1, message: 'unknow' });
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
const packages = {};
loader({ dir: path.join(__dirname, '../config/error-codes') }, (info) => {
  if (info.ext === '') {
    const lang = info.filename
    const package = {};
    loader({ dir: path.join(info.dir, info.filename) }, (detail) => {
      if (detail.ext) {
        const name = detail.filename.toUpperCase();
        const data = require(detail.fullpath);
        package[name] = data;
      }
    });
    packages[lang] = package;
  }
})

module.exports = {
  BizError,
  genByBiz,
  packages,
}