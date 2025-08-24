import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json()
    
    if (!type || !['cleanup', 'carpool', 'zerowaste'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid activity type. Must be cleanup, carpool, or zerowaste.' },
        { status: 400 }
      )
    }

    // Mock activity creation - in real app this would save to database
    const newActivity = {
      id: `act_${Date.now()}`,
      type,
      status: 'draft',
      organizerId: 'currentUser', // Would come from session
      startedAt: new Date().toISOString(),
      location: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In real app: await db.activities.create(newActivity)
    
    return NextResponse.json({
      success: true,
      activity: newActivity,
      redirectUrl: `/activities/${type}`
    })
    
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}
