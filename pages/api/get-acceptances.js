// pages/api/get-acceptances.js
import { redis, getRedis } from '../../lib/redis'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Ensure Redis client is available
    let client = redis
    if (!client) {
      try {
        client = getRedis()
      } catch (err) {
        return res.status(500).json({
          error: 'Redis not configured',
          message: 'Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables',
          environment: {
            hasUrl: !!process.env.UPSTASH_REDIS_REST_URL,
            hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN
          }
        })
      }
    }

    // Get all acceptance IDs
    const acceptanceIds = await client.lrange('all_acceptances', 0, -1)

    // Get all acceptance data
    const acceptances = []
    for (const id of acceptanceIds) {
      const acceptance = await client.hgetall(id)
      if (acceptance && acceptance.id) {
        acceptances.push(acceptance)
      }
    }

    // Sort by most recent first
    acceptances.sort((a, b) => new Date(b.acceptedAt) - new Date(a.acceptedAt))

    res.status(200).json(acceptances)

  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}