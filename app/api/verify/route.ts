import { NextResponse } from 'next/server'
import { redis, getRedis } from '../../../lib/redis'

export async function GET() {
  try {
    // Prefer the shared client from lib/redis; fall back to getRedis() which
    // throws a clear error if the environment isn't configured.
    let client = redis
    if (!client) {
      client = getRedis()
    }

    await client.set('verify_test', 'working')
    const result = await client.get('verify_test')

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