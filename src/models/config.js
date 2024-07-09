import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { v4 } from 'uuid';
import constant from "../constant.js"
import ejs from 'ejs'

class Config extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
      _id: {
        type: String, // 唯一名称
        default: v4,
      },
      project_id: {
        type: String,
        default: ''
      },
      title: {
        type: String,
      },
      name: {
        type: String,
      },
      desc: {
        type: String,
      },
      type: {
        type: mongoose.Schema.Types.Mixed,
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
    schema.statics.reaload = async (app) => {

    }
    this.model = mongoose.model('Config', schema);
    BaseModel.models.Config = this.model;
  }

  async reload(app) {
    console.log('reload config');
    const config_items = await this.model.find({}).lean(true);
    config_items.forEach(item => {
      app.context.config[item.name] = item.value;
      if (item.type === 'email_template') {
        constant.emailTemplats[item.name] = ejs.compile(item.value.html);
      }
    })
  }
}

export default new Config();