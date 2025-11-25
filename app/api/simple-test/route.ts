import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    await redis.set('simple_test', 'Working!')
    const result = await redis.get('simple_test')
    
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