import { NextResponse } from 'next/server'
import { setValue } from '@/lib/redis-utils'

export async function GET() {
  try {
    // Create test acceptance data
    const testData = {
      accepted: true,
      timestamp: new Date().toISOString(),
      termsVersion: '1.0',
      userId: 'test_user_123',
      ipAddress: '192.168.1.1',
      test: true
    }

    await setValue('terms_acceptance:test_user_123', testData)
    
    return NextResponse.json({
      success: true,
      message: 'Test data created in Redis',
      data: testData
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}