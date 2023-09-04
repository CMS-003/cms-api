const BaseBLL = require('../base');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

class ComponentTypeBLL extends BaseBLL {
  constructor() {
    super();
    const schema = new Schema({
      _id: {
        type: String,
      },
      title: {
        type: String,
        comment: '标题(中文,显示用)'
      },
      name: {
        type: String,
        comment: '名称(英文,标记用)'
      },
      cover: {
        type: String,
        default: '',
      },
      accepts: {
        type: [String],
        comment: '可接受的子组件'
      },
      order: {
        type: Number,
        default: 0,
      },
      status: {
        type: Number,
        default: 0,
      },
      createdAt: {
        type: Date,
        default: () => dayjs().toDate(),
      },
      updatedAt: {
        type: Date,
        default: () => dayjs().toDate(),
      },
    }, {
      strict: true,
      collection: 'component_type',
    });
    this.model = mongoose.model('ComponentType', schema);
    BaseBLL.models.ComponentType = this.model;
  }
}

module.exports = new ComponentTypeBLL();