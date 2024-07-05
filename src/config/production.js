export default {
  PORT: 3334,
  timezone: process.env.timezone || '+08:00',
  language: process.env.language || 'zh-CN',
  mongo_url: process.env.MONGO_URL,
  resource_api_prefix: 'novel-api:8097',
  USER_TOKEN_SECRET: process.env.USER_TOKEN_SECRET || 'lp#yBMS0f!4IleTVnpA@'
}