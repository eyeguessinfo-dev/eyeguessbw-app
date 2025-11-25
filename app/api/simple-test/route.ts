import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    // Simple set and get
    await redis.set('simple_test', 'Hello Redis!')
    const result = await redis.get('simple_test')
    
    return NextResponse.json({
      success: true,
      message: 'Redis is working!',
      data: result
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      env: {
        url: process.env.UPSTASH_REDIS_REST_URL ? 'Set' : 'Missing',
        token: process.env.UPSTASH_REDIS_REST_TOKEN ? 'Set' : 'Missing'
      }
    }, { status: 500 })
  }
}