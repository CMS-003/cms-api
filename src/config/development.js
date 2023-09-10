module.exports = {
  PORT: 3334,
  timezone: 'Asia/Shanghai',
  language: 'zh-CN',
  mongo_url: 'mongodb://root:123456@127.0.0.1:27017/manage?authSource=admin',
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
  page_public_url: 'http://localhost:3000',
  USER_TOKEN_SECRET: 'lp#yBMS0f!4IleTVnpA@'
}