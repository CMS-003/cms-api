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
  MVerification,
  MLog,
  MCounter,
  MCapsule,
  MTask,
  MSchedule,
  MView,
  MInterface,
} from 'schema'

const manager = mongoose.createConnection(config.mongo_manager_url);
const content = mongoose.createConnection(config.mongo_content_url);
const crawler = mongoose.createConnection(config.mongo_crawler_url);

const User = new MUser(manager, {
  methods: {
    isEqual: function (password) {
      return this.pass === this.caculate(password);
    },
    caculate: function (pass) {
      const hmac = crypto.createHmac('sha1', this.salt);
      hmac.update(pass);
      return hmac.digest('hex').toString();
    }
  }
});
const Config = new MConfig(manager);
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
const Verification = new MVerification(manager);
const Schedule = new MSchedule(manager);
const View = new MView(manager);
const Interface = new MInterface(manager);

export const dbs = {
  manager,
  content,
  crawler,
}

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
  Verification,
  Schedule,
  View,
  Interface,
}