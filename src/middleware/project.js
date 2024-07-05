
export default async (ctx, next) => {
  const project_id = ctx.request.get('x-project-id')
  if (project_id) {
    ctx.state.project_id = project_id
  }
  await next()
}