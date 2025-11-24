// pages/api/test-db.js
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

export default async function handler(req, res) {
  let client

  try {
    client = new MongoClient(uri)
    await client.connect()
    
    const database = client.db('eyeguess')
    const collections = await database.listCollections().toArray()
    
    res.status(200).json({ 
      success: true, 
      message: 'Database connected successfully!',
      collections: collections.map(c => c.name)
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  } finally {
    if (client) await client.close()
  }
}