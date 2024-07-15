import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'
import dayjs from 'dayjs'

class Widget extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
      _id: {
        type: String, // Input,Image,Switch,Select,RemoteSelect,Editor,Area
      },
      name: {
        type: String,
      },
      attrs: {
        type: Object,
      },
      createdAt: {
        type: Date,
        default: () => dayjs().toDate(),
      },
    }, {
      strict: true,
      versionKey: false,
      excludeIndexes: true,
      collection: 'widget_info',
    });
    this.model = mongoose.model('Widget', schema);
    BaseModel.models.Widget = this.model;
  }
}

export default new Widget();