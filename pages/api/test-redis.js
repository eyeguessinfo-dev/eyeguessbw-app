// pages/api/test-redis.js
import { redis, getRedis } from '../../lib/redis'

export default async function handler(req, res) {
  // Ensure Redis client is available
  let client = redis
  if (!client) {
    try {
      client = getRedis()
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Redis not configured',
        message: 'Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables',
        environment: {
          hasUrl: !!process.env.UPSTASH_REDIS_REST_URL,
          hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN
        }
      })
    }
  }

  try {
    console.log('Testing Redis connection...')

    // Simple SET/GET test
    await client.set('test_key', 'Hello from Upstash Redis!')
    const value = await client.get('test_key')

    // List operations test
    await client.lpush('test_list', 'item1', 'item2', 'item3')
    const listItems = await client.lrange('test_list', 0, -1)

    res.status(200).json({
      success: true,
      message: 'Upstash Redis is working! 🎉',
      data: {
        testKey: value,
        testList: listItems
      },
      environment: {
        hasUrl: !!process.env.UPSTASH_REDIS_REST_URL,
        hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN
      }
    })
  } catch (error) {
    console.error('Redis test failed:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      environment: {
        hasUrl: !!process.env.UPSTASH_REDIS_REST_URL,
        hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN
      }
    })
  }
}
