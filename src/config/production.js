export default {
  PORT: 3334,
  timezone: process.env.timezone || '+08:00',
  language: process.env.language || 'zh-CN',
  mongo_manage_url: process.env.mongo_manager_url,
  mongo_content_url: process.env.mongo_content_url,
  mongo_download_url: process.env.mongo_crawler_url,
  resource_api_prefix: 'novel-api:8097',
  page_public_url: 'https://u67631x482.vicp.fun',
  USER_TOKEN_SECRET: process.env.USER_TOKEN_SECRET || 'lp#yBMS0f!4IleTVnpA@'
}