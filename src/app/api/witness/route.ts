import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { activityId, confirm, notes } = body || {}
    if (!activityId) return NextResponse.json({ error: 'activityId required' }, { status: 400 })
    return NextResponse.json({ status: confirm ? 'accepted' : 'flagged' })
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}


