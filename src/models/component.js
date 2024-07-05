import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'

class Component extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
      _id: {
        type: String,
      },
      project_id: {
        type: String,
      },
      template_id: {
        type: String,
      },
      tree_id: {
        type: String,
      },
      parent_id: {
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
      icon: {
        type: String,
      },
      type: {
        type: String,
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
      order: {
        type: Number,
        default: 0,
      },
      resources: [{
        _id: String,
        title: String,
        cover: String,
      }],
      attrs: {
        type: Object,
        default: {}
      },
      style: {
        type: Object,
        default: {},
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    }, {
      strict: true,
      collection: 'component_info',
    });
    this.model = mongoose.model('Component', schema);
    BaseModel.models.Component = this.model;
  }
}

export default new Component();