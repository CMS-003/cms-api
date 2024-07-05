import BaseModel from '../utils/baseModel.js'
import mongoose from 'mongoose'

class Project extends BaseModel {
  constructor() {
    super();
    const schema = new mongoose.Schema({
      _id: {
        type: String,
      },
      title: {
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
      status: {
        type: Number,
        default: 0,
      },
    }, {
      strict: true,
      collection: 'project_info',
    });
    this.model = mongoose.model('Project', schema);
    BaseModel.models.Project = this.model;
  }
}

export default new Project();