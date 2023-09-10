const urlSchema = require('url').URLSearchParams
module.exports = {
  PORT: 3334,
  timezone: process.env.timezone || '+08:00',
  language: process.env.language || 'zh-CN',
  mongo_url: process.env.MONGO_URL,
  USER_TOKEN_SECRET: process.env.USER_TOKEN_SECRET || 'lp#yBMS0f!4IleTVnpA@'
}