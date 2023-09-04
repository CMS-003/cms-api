const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const dayjs = require('dayjs');
const BaseBLL = require('../base');

class Config extends BaseBLL {
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
      name: {
        type: String,
      },
      desc: {
        type: String,
      },
      type: {
        type: String,
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
      collections: 'config_info',
    });
    this.model = mongoose.model('Config', schema);
    BaseBLL.models.Config = this.model;
  }
}

module.exports = new Config();