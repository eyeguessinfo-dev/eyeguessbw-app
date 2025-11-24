// pages/api/test-redis.js
import { Redis } from '@upstash/redis'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

let redis
if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  })
}

export default async function handler(req, res) {
  if (!redis) {
    return res.status(500).json({
      success: false,
      error: 'Redis not configured',
      message: 'Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables',
      environment: {
        hasUrl: !!redisUrl,
        hasToken: !!redisToken
      }
    })
  }

  try {
    console.log('Testing Redis connection...')
    
    // Simple SET/GET test
    await redis.set('test_key', 'Hello from Upstash Redis!')
    const value = await redis.get('test_key')
    
    // List operations test
    await redis.lpush('test_list', 'item1', 'item2', 'item3')
    const listItems = await redis.lrange('test_list', 0, -1)

    res.status(200).json({
      success: true,
      message: 'Upstash Redis is working! 🎉',
      data: {
        testKey: value,
        testList: listItems
      },
      environment: {
        hasUrl: true,
        hasToken: true
      }
    })
  } catch (error) {
    console.error('Redis test failed:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      environment: {
        hasUrl: !!redisUrl,
        hasToken: !!redisToken
      }
    })
  }
}
