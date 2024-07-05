import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'
import dayjs from 'dayjs'

class Template extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
      _id: {
        type: String,
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
      cover: {
        type: String,
      },
      type: {
        type: String, // form list page
      },
      path: {
        type: String,
      },
      attrs: {
        type: Object,
        default: {},
      },
      style: {
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
      fields: [
        { component: String, fields: String, title: String, autoFocus: Boolean, dataType: String, dataValue: mongoose.Schema.Types.Mixed }
      ],
      available: {
        type: Boolean
      },
      order: {
        type: Number,
        default: 1
      }
    }, {
      strict: true,
      collection: 'template_info',
    });
    this.model = mongoose.model('Template', schema);
    BaseModel.models.Template = this.model;
  }
}

export default new Template();