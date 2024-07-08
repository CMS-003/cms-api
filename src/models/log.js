import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { v4 } from 'uuid'

class Log extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
      _id: {
        type: String, // 唯一名称
        default: v4,
      },
      // log,info,error,
      type: {
        type: String,
      },
      group: {
        type: String,
      },
      content: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: () => dayjs().toDate(),
      },
    }, {
      strict: true,
      collection: 'log_info',
    });
    schema.statics.log = function (name, content) {
      this.create({ name, content });
    }
    schema.methods.print = function () {
      console.log(this.name);
    }
    this.model = mongoose.model('Log', schema);
    BaseModel.models.Log = this.model;
  }
}

export default new Log();