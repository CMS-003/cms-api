const { genByBiz, BizError } = require('../utils/bizError');

module.exports = async (ctx, next) => {
  // TODO: lang init
  try {
    await next()
  } catch (e) {
    console.log(e.message, 'interrept')
    const lang = ctx.state.lang || 'zh-CN';
    if (e instanceof BizError !== true) {
      e.bizName = 'UNKNOWN';
    }
    const result = genByBiz(e, lang);
    ctx.status = result.status;
    ctx.body = result.data;
  }
}