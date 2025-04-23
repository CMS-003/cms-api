import { verifyToken } from '#services/user.js';

export default async (ctx, next) => {
  const token = ctx.get('authorization') || ctx.query.authorization || '';
  if (!token) {
    return ctx.response.throwBiz('AUTH.tokenFail')
  }
  const user = await verifyToken(token)
  ctx.state.user = user;
  await next();
}