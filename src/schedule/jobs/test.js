const dayjs = require('../../utils/dayjs')

module.exports = {
  name: 'test',
  rule: '*/5 * * * * *',
  tick(date, app) {
    console.log(this.name, dayjs.utc().tz('Asia/Shanghai').format());
  },
}