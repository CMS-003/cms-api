const mongoose = require('mongoose');
const BaseBLL = require('../base');

class Project extends BaseBLL {
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
    BaseBLL.models.Project = this.model;
  }
}

module.exports = new Project();