import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { type, name, windowStart, windowEnd, locationText, region, factorSet, autoClose } = body || {}
    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 })
    }
    // Stub ids/tokens
    const activityId = Math.random().toString(36).slice(2, 10)
    const organizerToken = Math.random().toString(36).slice(2, 10)
    const participantToken = Math.random().toString(36).slice(2, 10)
    const witnessToken = Math.random().toString(36).slice(2, 10)
    const orgId = Math.random().toString(36).slice(2, 8)
    const orgToken = Math.random().toString(36).slice(2, 10)

    return NextResponse.json({ activityId, organizerToken, participantToken, witnessToken, orgId, orgToken })
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}

