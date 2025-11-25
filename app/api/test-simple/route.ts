import { NextResponse } from 'next/server'
import { redis, getRedis } from '@/lib/redis'

export async function GET() {
  try {
    const client = redis ?? getRedis()
    await client.set('simple_test', 'Working!')
    const result = await client.get('simple_test')
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Redis connection successful!'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}