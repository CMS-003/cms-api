import jwt from 'jsonwebtoken'

export default async (ctx, next) => {
  const token = ctx.get('authorization') || ctx.query.authorization || '';
  if (!token) {
    return ctx.response.throwBiz('AUTH.tokenFail')
  }
  try {
    const [type, sign] = token.split(' ');
    const user = jwt.verify(sign || '', ctx.config.USER_TOKEN_SECRET)
    ctx.state.user = user;
    await next();
  } catch (e) {
    // TokenExpiredError, ReferenceError
    if (e.name === 'TokenExpiredError') {
      ctx.response.throwBiz('AUTH.tokenExpired');
    } else {
      ctx.response.throwBiz('AUTH.tokenFail')
    }
  }
}