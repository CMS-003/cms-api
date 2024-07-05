import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'

class Sns extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
      // phone,email,google,github,alipay
      _id: {
        type: String,
      },
      sns_id: String,
      sns_type: String,
      user_id: String,
      nickname: {
        type: String,
        comment: '昵称'
      },
      avatar: {
        type: String,
        default: '',
      },
      createdAt: {
        type: Date,
        default: () => new Date(),
      },
      detail: Object,
      status: {
        type: Number,
        default: 0,
      },
      access_token: String,
      access_expired_at: Date,
      refresh_token: String,
      refresh_expired_at: Date,
    }, {
      strict: true,
      collection: 'sns_info',
    });
    this.model = mongoose.model('Sns', schema);

    BaseModel.models.Sns = this.model;
  }
}

export default new Sns();