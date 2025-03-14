async function getTree(Component, tree_id) {
  const items = await Component.getAll({ where: { tree_id }, sort: { order: 1 }, lean: true })
  items.forEach(v => v.children = []);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    for (let j = 0; j < items.length; j++) {
      if (j !== i) {
        if (items[j].parent_id === item._id) {
          item.children.push(items[j]);
        }
      }
    }
  }
  const tree = items.find(item => item.parent_id === '');
  return tree;
}

export default {
  getTree,
}