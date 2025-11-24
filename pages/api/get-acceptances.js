// pages/api/get-acceptances.js
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get all acceptance IDs
    const acceptanceIds = await redis.lrange('all_acceptances', 0, -1)
    
    // Get all acceptance data
    const acceptances = []
    for (const id of acceptanceIds) {
      const acceptance = await redis.hgetall(id)
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