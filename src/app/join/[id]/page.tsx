"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function JoinPage({ params, searchParams }: any) {
  const activityId = params.id
  const [baseline, setBaseline] = useState('Solo car')
  const [actual, setActual] = useState('Transit')
  const [distance, setDistance] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, role: 'participant', payload: { baseline, actual, distance } }),
      })
      if (!res.ok) throw new Error('fail')
      alert('Thanks — your evidence was received.')
    } catch {
      alert('Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[560px] mx-auto px-6 py-8 space-y-4">
      <h1 className="text-[24px] leading-[28px] font-semibold text-zinc-900">Participant form</h1>
      <div className="space-y-2">
        <label className="text-sm text-zinc-600">Baseline → Actual</label>
        <Input value={`${baseline} → ${actual}`} onChange={()=>{}} readOnly />
      </div>
      <div>
        <label className="text-sm text-zinc-600">Distance (km)</label>
        <Input value={distance} onChange={(e)=>setDistance(e.target.value)} placeholder="e.g., 8" />
      </div>
      <Button onClick={onSubmit} disabled={submitting} className="h-11">Submit</Button>
    </div>
  )
}


