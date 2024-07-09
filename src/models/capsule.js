import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { v4 } from 'uuid'

class Capsule extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
      _id: {
        type: String, // 唯一名称
        default: v4,
      },
      name: {
        type: String,
      },
      receiver: {
        type: String,
      },
      content: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: () => dayjs().toDate(),
      },
      expiredAt: {
        type: Date,
      }
    }, {
      strict: true,
      collection: 'capsule_info',
    });
    this.model = mongoose.model('Capsule', schema);
    BaseModel.models.Capsule = this.model;
  }
}

export default new Capsule();