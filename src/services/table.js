import models from '../models/index.js'

export async function getTableViews(name) {
  const views = await models.View.getAll({ where: { table: name } });
  return views;
}