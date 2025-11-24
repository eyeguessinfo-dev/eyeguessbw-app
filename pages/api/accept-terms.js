// pages/api/accept-terms.js
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { clientName, clientEmail, package: selectedPackage, signature } = req.body

    if (!clientName || !clientEmail || !selectedPackage || !signature) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const acceptanceId = `acceptance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const acceptance = {
      id: acceptanceId,
      clientName,
      clientEmail,
      selectedPackage,
      signature,
      acceptedAt: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    }

    // Store in Redis
    await redis.hset(acceptanceId, acceptance)
    
    // Also add to a list of all acceptances
    await redis.lpush('all_acceptances', acceptanceId)

    res.status(200).json({
      success: true,
      acceptanceId,
      message: 'Terms accepted successfully'
    })

  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}