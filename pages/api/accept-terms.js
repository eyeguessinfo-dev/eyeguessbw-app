import { createHash } from 'crypto'

// Simple storage - replace with your database
const acceptances = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { clientName, clientEmail, package, signature } = req.body

    // Create unique acceptance ID
    const acceptanceId = createHash('sha256')
      .update(`${clientEmail}-${Date.now()}`)
      .digest('hex')
      .substring(0, 16)

    // Store acceptance (in production, save to database)
    acceptances.set(acceptanceId, {
      clientName,
      clientEmail,
      package,
      signature,
      acceptedAt: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    })

    res.status(200).json({ 
      success: true, 
      acceptanceId 
    })

  } catch (error) {
    res.status(500).json({ error: 'Failed to record acceptance' })
  }
}