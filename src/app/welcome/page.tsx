"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function WelcomePage() {
  const router = useRouter()
  const [inviteUrl, setInviteUrl] = useState("")
  const [inviteError, setInviteError] = useState("")
  const [creating, setCreating] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  useEffect(() => {
    const hasSession = typeof window !== 'undefined' && (localStorage.getItem('guest') === '0' || localStorage.getItem('sb-access-token'))
    if (hasSession) return
  }, [router])

  const createNoLogin = async () => {
    try {
      setCreating(true)
      localStorage.setItem('guest','1')
      const res = await fetch('/api/activities/new', { method: 'POST' }).catch(() => undefined)
      if (res && res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data?.redirectUrl) { router.push(data.redirectUrl); return }
      }
      router.push('/new')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-dvh bg-white flex items-start">
      <div className="w-full max-w-[720px] mx-auto px-4 md:px-6 pt-10 pb-16">
        {/* Brand */}
        <div className="mb-6">
          <img src="/logo1.svg" alt="CO₂ Receipt" className="h-14 w-auto" />
        </div>

        {/* Title block */}
        <div className="min-h-[96px]">
          <h1 className="text-[32px] leading-[40px] font-semibold text-zinc-900">Turn action into proof.</h1>
          <p className="text-[14px] leading-[20px] text-zinc-600 mt-2">Start with an activity. Only two steps — Setup → Share.</p>
        </div>

        {/* Primary CTA */}
        <div className="mt-6">
          <Button onClick={createNoLogin} disabled={creating} className="h-14 rounded-xl px-5">{creating ? 'Creating…' : 'Create activity (no login)'}</Button>
          <p className="text-[12px] leading-[16px] text-zinc-500 mt-2">You’ll get an organizer link to share with your team.</p>
        </div>

        {/* Invite utility (collapsible) */}
        <div className="mt-4">
          <button
            aria-expanded={inviteOpen}
            onClick={()=>setInviteOpen(v=>!v)}
            className="text-[14px] leading-[20px] text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          >
            Have an invite link?
          </button>
          {inviteOpen && (
            <div className="mt-2 border border-zinc-200 rounded-xl p-3 bg-white">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Paste organizer / participant / witness link"
                  value={inviteUrl}
                  onChange={(e)=>{ setInviteUrl(e.target.value); setInviteError('') }}
                  aria-label="Invite link"
                  className={`h-10 flex-1 rounded-lg border px-4 placeholder:text-zinc-500 ${inviteError ? 'border-red-500' : 'border-zinc-300'}`}
                  onKeyDown={(e)=>{ if(e.key==='Enter'){ (document.getElementById('open-invite-btn') as HTMLButtonElement | null)?.click() } }}
                />
                <Button id="open-invite-btn" className="h-10" variant="outline" onClick={() => {
                  if (!inviteUrl) { setInviteError('Paste the link first'); return }
                  try {
                    const url = inviteUrl.startsWith('http') ? new URL(inviteUrl) : new URL(inviteUrl, window.location.origin)
                    const validPath = /(\/a\/|\/join\/|\/w\/)/.test(url.pathname)
                    const hasKey = url.searchParams.has('key')
                    if (validPath && hasKey) { router.push(url.toString()) } else { setInviteError('Invalid invite link.') }
                  } catch { setInviteError('Invalid invite link.') }
                }}>Open</Button>
              </div>
              {inviteError && <div className="text-[12px] leading-[16px] text-red-600 mt-2">{inviteError}</div>}
            </div>
          )}
        </div>

        {/* Demo link */}
        <div className="mt-4">
          <button onClick={()=>{ window.location.href='/r/demo' }} className="text-[14px] leading-[20px] text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">
            View demo receipt
          </button>
        </div>
      </div>
    </div>
  )
}


