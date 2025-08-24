"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const [inviteUrl, setInviteUrl] = useState("")
  const [inviteError, setInviteError] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    // If already logged in (placeholder check) redirect to dashboard
    const hasSession = typeof window !== 'undefined' && (localStorage.getItem('guest') === '0' || localStorage.getItem('sb-access-token'))
    if (hasSession) router.replace('/app/dashboard')
  }, [router])

  

  const createNoLogin = async () => {
    try {
      console.log('welcome_primary_click')
      setCreating(true)
      localStorage.setItem('guest','1')
      const res = await fetch('/api/activities/new', { method: 'POST' }).catch(() => undefined)
      if (res && res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data?.redirectUrl) {
          router.push(data.redirectUrl)
          return
        }
      }
      router.push('/new')
    } catch {
      // toast here if needed
    } finally {
      setCreating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Submit invite open on Enter
      const btn = document.getElementById('open-invite-btn') as HTMLButtonElement | null
      btn?.click()
    }
  }

  return (
    <div className="min-h-dvh bg-white flex items-center justify-center">
      <div className="max-w-[1200px] w-full px-10 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-8 items-start lg:items-center">
          {/* Left panel */}
          <div className="pt-24 pr-8 pb-24 pl-8">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-8 text-zinc-900">
              <img src="/logo1.svg" alt="CO₂ Receipt" className="h-14 w-auto" />
            </div>
            <div className="space-y-3">
              <h1 className="text-[40px] leading-[44px] tracking-tight font-semibold text-zinc-900">Turn action into proof. Start with an activity.</h1>
              <p className="text-[14px] leading-[20px] text-zinc-600 max-w-[46ch]">Create an activity, share a link with your team, and collect evidence. When you close it, we generate a verified CO₂ receipt. No account needed.</p>
            </div>

            {/* Primary create (no login) */}
            <div className="mt-4">
              <Button onClick={createNoLogin} disabled={creating} className="h-12 w-full rounded-xl text-[15px] leading-[22px]">{creating ? 'Creating…' : 'Create activity (no login)'}</Button>
              <p className="text-[12px] leading-[16px] text-zinc-500 mt-2">You’ll get an organizer link to share with your team.</p>
            </div>

            {/* Removed SSO and email for minimal MVP */}

            {/* Invite link */}
            <div className="mt-6">
              <div className="text-[12px] leading-[16px] uppercase tracking-wide text-zinc-500 mb-2">Have an invite link?</div>
              <div className="flex items-center gap-3">
                <Input 
                  placeholder="Paste organizer / participant / witness link"
                  value={inviteUrl}
                  onChange={(e)=>{ setInviteUrl(e.target.value); setInviteError('') }}
                  aria-label="Invite link"
                  className={`flex-1 h-11 rounded-lg border px-4 placeholder:text-zinc-500 ${inviteError ? 'border-red-500' : 'border-zinc-300'}`}
                  onKeyDown={handleKeyPress}
                />
                <Button 
                  id="open-invite-btn"
                  aria-label="Open invite"
                  variant="outline"
                  className="h-11 rounded-lg border-indigo-600 text-indigo-700 hover:bg-indigo-50"
                  onClick={() => {
                    if (!inviteUrl) { setInviteError('Paste the link first'); return }
                    try {
                      const url = inviteUrl.startsWith('http') ? new URL(inviteUrl) : new URL(inviteUrl, window.location.origin)
                      const validPath = /(\/a\/|\/join\/|\/w\/)/.test(url.pathname)
                      const hasKey = url.searchParams.has('key')
                      if (validPath && hasKey) {
                        console.log('welcome_invite_open_success')
                        router.push(url.toString())
                      } else {
                        console.log('welcome_invite_open_invalid')
                        setInviteError('Invalid invite link.')
                      }
                    } catch {
                      console.log('welcome_invite_open_invalid')
                      setInviteError('Invalid invite link.')
                    }
                  }}
                >
                  Open
                </Button>
              </div>
              {inviteError && <div className="text-[12px] leading-[16px] text-red-600 mt-2">{inviteError}</div>}
            </div>

            {/* Secondary: View demo receipt (text button, no container hover) */}
            <div className="mt-6 text-center">
              <button
                onClick={() => { window.location.href = '/r/demo' }}
                className="text-zinc-600 hover:text-zinc-800 text-[14px] leading-[20px] font-medium focus:outline-none"
                aria-label="View demo receipt"
              >
                View demo receipt
              </button>
            </div>

            {/* Legal removed for minimal MVP per brief */}
          </div>

          {/* Right hero */}
          <div className="px-10 md:px-0 w-full lg:flex lg:items-center">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-indigo-50 to-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] relative overflow-hidden hidden lg:block" aria-label="Illustration: turn action into proof">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-zinc-400 text-xs">Image Placeholder 4:3</span>
              </div>
            </div>
            <div className="lg:hidden mt-6">
              <div className="h-[240px] w-full rounded-xl bg-gradient-to-br from-indigo-50 to-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] relative overflow-hidden" aria-label="Illustration: turn action into proof">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-zinc-400 text-xs">Image Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


