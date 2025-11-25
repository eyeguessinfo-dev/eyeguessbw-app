import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    redis: {
      url: process.env.UPSTASH_REDIS_REST_URL || '❌ MISSING',
      token: process.env.UPSTASH_REDIS_REST_TOKEN ? '✅ SET' : '❌ MISSING',
      urlValue: process.env.UPSTASH_REDIS_REST_URL,
      tokenPreview: process.env.UPSTASH_REDIS_REST_TOKEN ? 
        process.env.UPSTASH_REDIS_REST_TOKEN.substring(0, 10) + '...' : 'MISSING'
    }
  })
}