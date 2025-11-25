import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    // Get all keys that match the pattern
    const keys = await redis.keys('terms_acceptance:*')
    
    console.log('Found keys:', keys)

    const acceptances = []
    
    for (const key of keys) {
      const value = await redis.get(key)
      if (value) {
        acceptances.push({
          key: key,
          data: JSON.parse(value as string)
        })
      }
    }

    return NextResponse.json({
      success: true,
      count: acceptances.length,
      keys: keys,
      acceptances: acceptances
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}