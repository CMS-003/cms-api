
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
  return redis;
}

export function getRedis() {
  return redis;
}