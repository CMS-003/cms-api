const BaseBLL = require('../base');

class Job extends BaseBLL {
  constructor(models, model_name) {
    super(models, model_name);
  }
}

module.exports = models => new Job(models, 'JobInfo');