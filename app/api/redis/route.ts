import { NextResponse } from 'next/server'
import { setValue, getValue } from '@/lib/redis-utils'

export async function GET() {
  try {
    const testData = {
      message: 'Hello from Redis!',
      timestamp: new Date().toISOString(),
      status: 'working'
    }

    await setValue('api_test_key', testData, 60)
    const retrievedData = await getValue('api_test_key')

    return NextResponse.json({
      success: true,
      setData: testData,
      retrievedData: retrievedData,
      environment: process.env.NODE_ENV
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}