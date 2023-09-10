const schedule = require('node-schedule');
const _ = require('lodash');
const path = require('path');
const config = require('../config/index')
const loader = require('../utils/loader');

module.exports = function (app) {
  const schedules = {
    tasks: {},
    jobs: {},
    getJob(name) {
      return this.jobs[name] || null;
    },
    loadTask(job) {
      this.tasks[job.name] = job;
      return this;
    },
    start(name) {
      const task = this.tasks[name];
      if (this.jobs[name]) {
        console.log(`job ${name} exists`);
        return this;
      }
      if (task) {
        app.BLL.configBLL.update({ where: { name: `schedule_${name}` }, data: { $set: { value: true } } });
        this.jobs[task.name] = schedule.scheduleJob({ rule: task.rule, tz: config.timezone }, function (date) {
          task.tick && task.tick(date, app);
        })
      } else {
        console.log(`schedule ${name} not exists!`)
      }
      return this;
    },
    stop(name) {
      const job = this.jobs[name];
      if (job) {
        app.BLL.configBLL.update({ where: { name: `schedule_${name}` }, data: { $set: { value: false } } });
        delete this.jobs[name];
        return schedule.cancelJob(job);
      }
      return true;
    },
    tick(name) {
      const task = this.tasks[name];
      if (task) {
        task.tick && task.tick(new Date(), app);
      } else {
        console.log(`schedule ${name} not found!`)
      }
    }
  }

  loader({ dir: path.join(__dirname, 'jobs') }, function (info) {
    const task = require(info.fullpath)
    if (task) {
      schedules.loadTask(task);
      const auto_start = _.get(app.config, `schedule_${task.name}`, false);
      console.log(`load schedule ${task.name}, start: ${auto_start}`);
      if (auto_start) {
        schedules.start(task.name);
      }
    }
  });
  return schedules;
}