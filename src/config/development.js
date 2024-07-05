export default {
  PORT: 3334,
  timezone: 'Asia/Shanghai',
  language: 'zh-CN',
  mongo_url: 'mongodb://root:123456@192.168.0.124:27017/manage?authSource=admin',
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
  resource_api_prefix: 'http://127.0.0.1:3334',
  page_public_url: 'https://u67631x482.vicp.fun',
  USER_TOKEN_SECRET: 'lp#yBMS0f!4IleTVnpA@'
}