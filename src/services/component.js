const BLL = require('../BLL/index.js');

async function getTree(tree_id) {
  const items = await BLL.componentBLL.getAll({ where: { tree_id }, order: { order: 1 }, lean: true })
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.children = [];
    items[i].children = [];
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

module.exports = {
  getTree,
}