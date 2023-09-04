module.exports = {
  PORT: 3335,
  timezone: 'Asia/Shanghai',
  language: 'zh-CN',
  mongo: {
    host: '127.0.0.1',
    port: '27017',
    user: 'root',
    pass: '123456',
    db: 'manage',
    query: {
      authSource: 'admin'
    }
  },
  USER_TOKEN_SECRET: 'lp#yBMS0f!4IleTVnpA@'
}