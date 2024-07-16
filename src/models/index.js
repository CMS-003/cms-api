import ejs from 'ejs'
import crypto from 'crypto'
import mongoose from 'mongoose';
import constant from '../constant.js';
import config from '../config/index.js';

import {
  MUser,
  MSns,
  MConfig,
  MComponent,
  MComponentType,
  MProject,
  MTemplate,
  MWidget,
  MLog,
  MCounter,
  MCapsule,
  MTask,
} from 'schema'

const db_manage = mongoose.createConnection(config.mongo_manage_url);
const db_content = mongoose.createConnection(config.mongo_content_url);
const db_download = mongoose.createConnection(config.mongo_download_url);

class MConfig2 extends MConfig {
  constructor(db) {
    super(db);
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
class MUser2 extends MUser {
  constructor(db, params) {
    super(db, params);
  }
}
const Config = new MConfig2(db_manage);
const User = new MUser2(db_manage, {
  methods: {
    isEqual: function (password) {
      return this._doc.pass === this.caculate(password);
    },
    caculate: function (pass) {
      const hmac = crypto.createHmac('sha1', this._doc.salt);
      hmac.update(pass);
      return hmac.digest('hex').toString();
    }
  }
});
const Log = new MLog(db_manage);
const Sns = new MSns(db_manage);
const Component = new MComponent(db_manage);
const ComponentType = new MComponentType(db_manage);
const Project = new MProject(db_manage);
const Template = new MTemplate(db_manage);
const Widget = new MWidget(db_manage);
const Capsule = new MCapsule(db_manage);
const Counter = new MCounter(db_content);
const Task = new MTask(db_download);

export default {
  Config,
  User,
  Log,
  Sns,
  Component,
  ComponentType,
  Project,
  Template,
  Widget,
  Capsule,
  Counter,
  Task,
}