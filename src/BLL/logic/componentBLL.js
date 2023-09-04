const BaseBLL = require('../base');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

class ComponentBLL extends BaseBLL {
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
      desc: {
        type: String,
        default: '',
      },
      accepts: {
        type: [String],
        comment: '可接受的子组件'
      },
      status: {
        type: Number,
        default: 0,
      },
    }, {
      strict: true,
      collections: 'component_info',
    });
    this.model = mongoose.model('Component', schema);
    BaseBLL.models.Component = this.model;
  }
}

module.exports = new ComponentBLL();