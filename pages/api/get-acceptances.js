// pages/api/get-acceptances.js
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let client

  try {
    client = new MongoClient(uri)
    await client.connect()

    const database = client.db('eyeguess')
    const collection = database.collection('acceptances')

    // Get all acceptances, sorted by most recent first
    const acceptances = await collection
      .find({})
      .sort({ acceptedAt: -1 })
      .toArray()

    res.status(200).json(acceptances)

  } catch (error) {
    console.error('MongoDB error:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    if (client) {
      await client.close()
    }
  }
}