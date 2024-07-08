import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { v4 } from 'uuid'

class Code extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
      _id: {
        type: String, // 唯一名称
        default: v4,
      },
      method: {
        // email,phone,
        type: String,
      },
      code: {
        type: String,
      },
      user_id: {
        type: String,
      },
      type: {
        // 1 registry 2 login 3 update pass 4 forgot pass 5 logoff 6 bind
        type: Number,
      },
      receiver: {
        // email, countrycode-number
        type: String,
      },
      // 1 已创建 2 已使用
      status: {
        type: Number,
      },
      content: {
        // template
        type: String,
      },
      createdAt: {
        type: Date,
        default: () => dayjs().toDate(),
      },
    }, {
      strict: true,
      collection: 'code_info',
    });
    this.model = mongoose.model('Code', schema);
    BaseModel.models.Code = this.model;
  }
}

export default new Code();