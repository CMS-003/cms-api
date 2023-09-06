
module.exports = async (ctx, next) => {
  const project_id = ctx.request.get('x-project-id')
  if (!project_id && ctx.request.url.startsWith('/api/v1')) {
    throw new Error('need project_id')
  }
  ctx.state.project_id = project_id
  await next()
}