// pages/api/accept-terms.js
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let client

  try {
    client = new MongoClient(uri)
    await client.connect()

    const database = client.db('eyeguess')
    const collection = database.collection('acceptances')

    const { clientName, clientEmail, package: selectedPackage, signature } = req.body

    if (!clientName || !clientEmail || !selectedPackage || !signature) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const acceptance = {
      clientName,
      clientEmail,
      selectedPackage,
      signature,
      acceptedAt: new Date(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    }

    const result = await collection.insertOne(acceptance)

    console.log('Terms accepted and saved to MongoDB:', {
      acceptanceId: result.insertedId,
      clientName,
      clientEmail,
      selectedPackage
    })

    res.status(200).json({
      success: true,
      acceptanceId: result.insertedId,
      message: 'Terms accepted successfully'
    })

  } catch (error) {
    console.error('MongoDB error:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    if (client) {
      await client.close()
    }
  }
}