import { NextResponse } from 'next/server'
import { setValue } from '@/lib/redis-utils'

export async function POST(request: Request) {
  try {
    const { userId, packageId, timestamp } = await request.json()

    const acceptanceData = {
      accepted: true,
      timestamp: timestamp,
      termsVersion: '1.0',
      userId: userId,
      packageId: packageId
    }

    await setValue(`terms_acceptance:${userId}`, acceptanceData)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}