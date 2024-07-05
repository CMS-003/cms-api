import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'
import dayjs from 'dayjs'

class ComponentType extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
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
      level: {
        type: Number,
        default: 1,
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
    BaseModel.models.ComponentType = this.model;
  }
}

export default new ComponentType();