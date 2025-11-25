import { NextResponse } from 'next/server'
import { redis, getRedis } from '@/lib/redis'

export async function GET() {
  try {
    // Ensure we have a Redis client
    const client = redis ?? getRedis()

    // Get all keys that match terms acceptance pattern
    const keys = await client.keys('terms_acceptance:*')
    
    const acceptances = []
    
    for (const key of keys) {
      const value = await client.get(key)
      if (value) {
        acceptances.push({
          key,
          ...JSON.parse(value as string)
        })
      }
    }

    return NextResponse.json({
      success: true,
      count: acceptances.length,
      acceptances
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}