export default {
  PORT: 3333,
  timezone: process.env.timezone || '+08:00',
  language: process.env.language || 'zh-CN',
  mongo_system_url: process.env.mongo_system_url,
  resource_api_prefix: 'novel-api:8097',
  page_public_url: 'https://u67631x482.vicp.fun',
  USER_TOKEN_SECRET: process.env.USER_TOKEN_SECRET || 'lp#yBMS0f!4IleTVnpA@'
}