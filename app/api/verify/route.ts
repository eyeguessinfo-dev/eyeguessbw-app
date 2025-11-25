import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export async function GET() {
  try {
    const redis = Redis.fromEnv() // This automatically uses UPSTASH_REDIS_REST_*
    
    await redis.set('verify_test', 'working')
    const result = await redis.get('verify_test')
    
    return NextResponse.json({
      success: true,
      message: 'Redis connection successful!',
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