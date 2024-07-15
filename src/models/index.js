// import Component from './component.js'
// import Config from './config.js'
// import Project from './project.js'
// import User from './user.js'
// import Sns from './sns.js'
// import ComponentType from './componentType.js'
// import Template from './template.js'

import mongoose from 'mongoose';
import { MConfig } from 'schema'

const db_manage = mongoose.createConnection('mongodb://root:123456@192.168.0.124:27017/manage?authSource=admin');

const Config = new MConfig(db_manage);

export default {
  Config
  // Component,
  // Config,
  // Project,
  // User,
  // Sns,
  // ComponentType,
  // Template,
}