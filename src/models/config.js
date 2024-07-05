import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'
import dayjs from 'dayjs'

class Config extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
      _id: {
        type: String, // 唯一名称
      },
      project_id: {
        type: String,
        default: ''
      },
      name: {
        type: String,
      },
      desc: {
        type: String,
      },
      type: {
        type: String,
      },
      value: {
        type: Object,
        default: {},
      },
      createdAt: {
        type: Date,
        default: () => dayjs().toDate(),
      },
      updatedAt: {
        type: Date,
        default: () => dayjs().toDate(),
      },
      order: {
        type: Number,
        default: 1
      }
    }, {
      strict: true,
      collection: 'config_info',
    });
    this.model = mongoose.model('Config', schema);
    BaseModel.models.Config = this.model;
  }
}

export default new Config();