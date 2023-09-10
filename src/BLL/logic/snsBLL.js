const BaseBLL = require('../base');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

class Sns extends BaseBLL {
  constructor() {
    super();
    const schema = new Schema({
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
    schema.loadClass(class Custom {
      isEqual(password) {
        return this._doc.pass === this.calculate(password, this._doc.salt);
      }
    })
    this.model = mongoose.model('Sns', schema);

    BaseBLL.models.Sns = this.model;
  }
}

module.exports = new Sns();