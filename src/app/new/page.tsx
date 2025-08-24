"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CustomDropdown } from '@/components/ui/custom-dropdown'
import { useRouter } from 'next/navigation'

const TYPES = [
  { label: 'Clean-up / Waste drive', value: 'cleanup' },
  { label: 'Mobility switch day', value: 'carpool' },
  { label: 'Zero-waste event', value: 'zerowaste' },
]

export default function NewActivityPage() {
  const router = useRouter()
  const [type, setType] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [focusIndex, setFocusIndex] = useState(0)

  const onCreate = async () => {
    if (!type) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/activities/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      try {
        localStorage.setItem(`activityTokens:${data.activityId}`, JSON.stringify(data))
        localStorage.setItem(`activityMeta:${data.activityId}`, JSON.stringify({ type }))
      } catch {}
      router.replace(`/a/${data.activityId}?key=${data.organizerToken}`)
    } catch (e) {
      alert("Couldn't create the activity. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[760px] mx-auto px-8 md:px-10 py-10">
      <h1 className="text-[32px] leading-[40px] font-semibold text-zinc-900 mb-6">Choose activity type</h1>

      <div className="space-y-4" role="radiogroup" aria-label="Choose activity type">
        {TYPES.map((t, i) => (
          <button
            key={t.value}
            id={`type-card-${i}`}
            onClick={() => setType(t.value)}
            onFocus={() => setFocusIndex(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); const ni = Math.min(TYPES.length-1, focusIndex+1); setFocusIndex(ni); setTimeout(()=>document.getElementById(`type-card-${ni}`)?.focus(),0) }
              if (e.key === 'ArrowUp') { e.preventDefault(); const ni = Math.max(0, focusIndex-1); setFocusIndex(ni); setTimeout(()=>document.getElementById(`type-card-${ni}`)?.focus(),0) }
              if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setType(t.value) }
            }}
            role="radio"
            aria-checked={type===t.value}
            tabIndex={focusIndex===i?0:-1}
            className={`w-full text-left border rounded-2xl p-5 min-h-[120px] flex items-start gap-4 hover:bg-zinc-50 hover:border-zinc-300 cursor-pointer select-none caret-transparent ${type===t.value?'border-2 border-indigo-600':'border border-zinc-200'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`}
          >
            {/* Left radio indicator */}
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${type===t.value?'border-indigo-600':'border-zinc-300'}`} aria-hidden="true">
              {type===t.value && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
            </div>
            <div className="flex-1 select-none">
              <div className="text-[16px] leading-[24px] font-semibold text-zinc-900 select-none">{t.label}</div>
              <p className="text-sm text-zinc-600 mt-1 select-none">
                {t.value==='cleanup' && 'Collect and sort waste. Turn bags/kg into a verified CO₂ receipt.'}
                {t.value==='carpool' && 'Switch from solo car to transit, bike, walk, or remote. Count avoided CO₂.'}
                {t.value==='zerowaste' && 'Run a low-waste event; track disposables avoided.'}
              </p>
              <p className="text-xs text-zinc-500 mt-1 select-none">
                {t.value==='cleanup' && 'Inputs: kg or bags→kg · participants · photos'}
                {t.value==='carpool' && 'Inputs: km or trips · baseline vs actual · optional photo'}
                {t.value==='zerowaste' && 'Inputs: cups/plates/cutlery (pcs) · attendees · photos'}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="sticky bottom-0 mt-6 pt-4 pb-2 bg-white">
        <Button onClick={onCreate} disabled={!type || submitting} className="h-12 rounded-xl px-6 w-full md:w-auto">
          {submitting ? 'Creating…' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}




