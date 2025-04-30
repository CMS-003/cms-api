
import config from '../config/index.js'
import { createClient } from 'redis';

let redis = null;
export async function initRedis() {
  if (!config.redis_url) {
    return redis;
  }
  redis = await createClient({
    url: config.redis_url,
  }).connect();
  redis.once('connection', () => {
    console.log('connected redis');
  })
  return redis;
}
/**
 * 创建一个 Redis 客户端
 * @returns {ReturnType<typeof createClient> | null} Redis 客户端实例
 */
export function getRedis() {
  return redis;
}