"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function WitnessPage({ params }: any) {
  const activityId = params.id
  const [checked, setChecked] = useState(false)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onConfirm = async (confirm: boolean) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/witness', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activityId, confirm, notes }) })
      if (!res.ok) throw new Error('fail')
      alert('Recorded. Thank you!')
    } catch {
      alert('Failed to record')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="max-w-[560px] mx-auto px-6 py-8 space-y-4">
      <h1 className="text-[24px] leading-[28px] font-semibold text-zinc-900">Witness confirmation</h1>
      <div className="flex items-center gap-2">
        <input id="c" type="checkbox" checked={checked} onChange={(e)=>setChecked(e.target.checked)} />
        <label htmlFor="c" className="text-sm text-zinc-700">I confirm the activity and attached evidence are authentic</label>
      </div>
      <div>
        <label className="text-sm text-zinc-600">Notes (optional)</label>
        <Input value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Optional" />
      </div>
      <div className="flex gap-2">
        <Button onClick={()=>onConfirm(true)} disabled={!checked || submitting} className="h-11">Confirm</Button>
        <Button variant="outline" onClick={()=>onConfirm(false)} disabled={submitting} className="h-11">Request change</Button>
      </div>
    </div>
  )
}


