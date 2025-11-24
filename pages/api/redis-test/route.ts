import { NextResponse } from 'next/server'
import { setValue, getValue } from '@/lib/redis-utils'

export async function GET() {
  try {
    // Test data
    const testData = {
      message: 'Hello from Redis API!',
      timestamp: new Date().toISOString(),
      status: 'working',
      test: 'API route test'
    }

    // Set value in Redis
    await setValue('api_test_key', testData, 60) // Expires in 60 seconds
    
    // Get value back from Redis
    const retrievedData = await getValue('api_test_key')

    return NextResponse.json({
      success: true,
      setData: testData,
      retrievedData: retrievedData,
      matches: JSON.stringify(testData) === JSON.stringify(retrievedData),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Check your Redis credentials and connection',
      environment: process.env.NODE_ENV
    }, { status: 500 })
  }
}