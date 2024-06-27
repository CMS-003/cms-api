const BaseBLL = require('../utils/baseBLL');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

class User extends BaseBLL {
  constructor() {
    super();
    const schema = new Schema({
      _id: {
        type: String,
      },
      account: String,
      nickname: {
        type: String,
        comment: '昵称'
      },
      avatar: {
        type: String,
        default: '',
      },
      pass: {
        type: String,
      },
      salt: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: () => new Date(),
      },
      status: {
        type: Number,
        default: 0,
      },
    }, {
      strict: true,
      collection: 'user_info',
    });
    schema.loadClass(class Custom {
      // 密码加盐后的加密密码
      calculate(pass) {
        const hmac = crypto.createHmac('sha1', this._doc.salt);
        hmac.update(pass);
        return hmac.digest('hex').toString();
      }
      isEqual(password) {
        return this._doc.pass === this.calculate(password, this._doc.salt);
      }
    })
    this.model = mongoose.model('User', schema);

    BaseBLL.models.User = this.model;
  }
}

module.exports = new User();