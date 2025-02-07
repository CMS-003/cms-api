import loggerCreator from '#utils/logger.js';
import { genByBiz, BizError } from '../utils/bizError.js'

const logger = loggerCreator('bizError');

export default async (ctx, next) => {
  // TODO: lang init
  try {
    await next()
  } catch (e) {
    const lang = ctx.state.lang || 'zh-CN';
    if (e instanceof BizError !== true) {
      e.bizName = 'UNKNOWN';
    }
    const result = genByBiz(e, lang);
    ctx.status = result.status;
    ctx.body = result.data;
    logger.error(result.data.code, result.data.message);
    logger.error(e.stack);
  }
}