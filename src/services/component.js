import _ from 'lodash'

export async function getTree(Component, tree_id) {
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

export function collectionResourceID(tree) {
  const ids = [];
  if (_.isArray(tree.resources)) {
    tree.resources.map(v => {
      v._id && ids.push(v._id)
    })
  }
  if (_.isArray(tree.children)) {
    for (let i = 0; i < tree.children.length; i++) {
      const results = collectionResourceID(tree.children[i]);
      ids.push(...results)
    }
  }
  return ids;
}

export function fillResources(tree, map) {
  if (_.isArray(tree.resources)) {
    tree.resources = tree.resources.map(v => map[v._id] || v);
  }
  if (_.isArray(tree.children)) {
    tree.children.forEach(child => {
      fillResources(child, map);
    })
  }
}