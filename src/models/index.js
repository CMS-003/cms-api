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

const manager = mongoose.createConnection(config.mongo_manager_url);
const content = mongoose.createConnection(config.mongo_content_url);
const crawler = mongoose.createConnection(config.mongo_crawler_url);

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
const Config = new MConfig2(manager);
const User = new MUser2(manager, {
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
const Log = new MLog(manager);
const Sns = new MSns(manager);
const Component = new MComponent(manager);
const ComponentType = new MComponentType(manager);
const Project = new MProject(manager);
const Template = new MTemplate(manager);
const Widget = new MWidget(manager);
const Capsule = new MCapsule(manager);
const Counter = new MCounter(content);
const Task = new MTask(crawler);

export default {
  dbs: {
    manager,
    content,
    crawler,
  },
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