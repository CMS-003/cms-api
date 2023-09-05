const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const dayjs = require('dayjs');
const BaseBLL = require('../base');

class Template extends BaseBLL {
  constructor() {
    super();
    const schema = new Schema({
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
        type: String,
      },
      path: {
        type: String,
      },
      attrs: {
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
    BaseBLL.models.Template = this.model;
  }
}

module.exports = new Template();