import { CronJob } from 'cron';
import vm2, { VMScript, NodeVM } from 'vm2';
import constant from '../constant.js';

class Scheduler {
  static tasks = {};
  static load(doc, context) {
    const { _id, name, cron, script, status } = doc;
    const code = new VMScript(script).compile();
    const tick = new NodeVM({
      console: 'inherit',
      sandbox: {
        process: {
          env: process.env,
        }
      },
      require: {
        external: true,
        root: constant.PATH.ROOT,
        builtin: ['*'],
      }
    }).run(code, {});
    const t = Scheduler.tasks[_id];
    if (t) {
      t.job.stop();
      delete Scheduler.tasks[_id];
    }
    const job = new CronJob(cron, function () {
      const task = Scheduler.tasks[_id];
      task.running = true;
      console.log(`${new Date().toISOString()} run task: ${_id}`);
      tick(context).then(() => {
        task.running = false;
      }).catch(e => {
        task.running = false;
        console.log(e);
      });
    }, null, status === 2, 'Asia/Shanghai');
    Scheduler.tasks[_id] = {
      active: status === 2 || status === 3,
      running: false,
      name,
      cron,
      job,
    }
  }
  static getTask(_id) {
    return Scheduler.tasks[_id];
  }
  static isActive(_id) {
    const task = Scheduler.tasks[_id];
    return task && task.active;
  }
  static isRunning(_id) {
    const task = Scheduler.tasks[_id];
    return task && task.running;
  }
  static tick(_id) {
    if (Scheduler.isActive(_id)) {
      try {
        console.log(`once ${_id}`);
        Scheduler.tasks[_id].job.fireOnTick();
      } catch (e) {
        console.log(e, `try schedule ${_id}`);
      }
      return true;
    }
    return false;
  }
  static start(_id) {
    if (Scheduler.tasks[_id]) {
      Scheduler.tasks[_id].job.start();
      return true;
    }
    return false;
  }
  static stop(_id) {
    if (Scheduler.tasks[_id]) {
      Scheduler.tasks[_id].job.stop();
    }
  }
}

export default Scheduler;