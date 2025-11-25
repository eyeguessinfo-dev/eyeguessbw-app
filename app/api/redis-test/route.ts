import { NextResponse } from 'next/server'
import { setValue, getValue } from '@/lib/redis-utils'

export async function GET() {
  try {
    const testData = {
      message: 'Redis is working!',
      timestamp: new Date().toISOString()
    }

    await setValue('test', testData)
    const result = await getValue('test')

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}