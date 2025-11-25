import { Redis } from '@upstash/redis'

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

let _redis: Redis | undefined
if (url && token) {
  _redis = new Redis({ url, token })
} else {
  // Don't throw on import — allow the app to start and provide helpful runtime error
  // Consumers can call `getRedis()` which will throw if not configured.
  console.warn('[lib/redis] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set')
}

export const redis = _redis

export function getRedis(): Redis {
  if (!_redis) {
    throw new Error('Upstash Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
  }
  return _redis
}