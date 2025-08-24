import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { activityId, role, payload } = body || {}
    if (!activityId || !role) {
      return NextResponse.json({ error: 'activityId and role are required' }, { status: 400 })
    }
    const submissionId = Math.random().toString(36).slice(2, 10)
    return NextResponse.json({ submissionId, status: 'received' })
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}


