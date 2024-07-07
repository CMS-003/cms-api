export default {
  PORT: 3334,
  timezone: process.env.timezone || '+08:00',
  language: process.env.language || 'zh-CN',
  mongo_url: process.env.MONGO_URL || 'mongodb://root:123456@192.168.0.124:27017/manage?authSource=admin',
  resource_api_prefix: 'novel-api:8097',
  page_public_url: 'https://u67631x482.vicp.fun',
  USER_TOKEN_SECRET: process.env.USER_TOKEN_SECRET || 'lp#yBMS0f!4IleTVnpA@'
}