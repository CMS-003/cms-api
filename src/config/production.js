export default {
  PORT: 3333,
  timezone: process.env.timezone || '+08:00',
  language: process.env.language || 'zh-CN',
  mongo_system_url: process.env.mongo_system_url,
  redis_url: process.env.redis_url,
  proxy_agent: process.env.proxy_agent,
  page_public_url: 'https://u67631x482.vicp.fun',
  USER_TOKEN_SECRET: process.env.USER_TOKEN_SECRET || 'lp#yBMS0f!4IleTVnpA@'
}