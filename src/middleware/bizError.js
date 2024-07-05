import { genByBiz, BizError } from '../utils/bizError.js'

export default async (ctx, next) => {
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