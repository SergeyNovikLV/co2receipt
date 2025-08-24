"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function buildParticipantUrl(activityId: string, participantToken?: string) {
  return `/join/${activityId}?key=${participantToken || ''}`
}

export default function OrganizerSkin({ params }: any) {
  const activityId = params.id as string
  const [tokens, setTokens] = useState<any>(null)
  const [name, setName] = useState('Clean-up / Waste drive')
  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')
  const [locationText, setLocationText] = useState('')
  const [region, setRegion] = useState('EU Baltics')
  const [factorSet, setFactorSet] = useState('v2025.1')
  const [autoClose, setAutoClose] = useState(true)
  const [status, setStatus] = useState<'Draft'|'Live'|'Closed'>('Draft')
  const [activeTab, setActiveTab] = useState<'collect'|'settings'>('collect')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`activityTokens:${activityId}`)
      if (raw) setTokens(JSON.parse(raw))
      const meta = localStorage.getItem(`activityMeta:${activityId}`)
      if (meta) {
        const m = JSON.parse(meta)
        if (m?.type === 'carpool') setName('Mobility switch day')
        if (m?.type === 'zerowaste') setName('Zero-waste event')
      }
    } catch {}
    if (!start) setStart(new Date().toISOString().slice(0,16))
    if (!end) { const d = new Date(); d.setDate(d.getDate()+7); setEnd(d.toISOString().slice(0,16)) }
  }, [activityId])

  const participantUrl = useMemo(() => buildParticipantUrl(activityId, tokens?.participantToken), [activityId, tokens])
  const meta = (() => { try { return JSON.parse(localStorage.getItem(`activityMeta:${activityId}`) || '{}') } catch { return {} } })()
  const type = meta?.type || 'cleanup'
  const copy = (text: string) => navigator.clipboard.writeText(text)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(participantUrl)}`

  return (
    <div className="max-w-[1100px] mx-auto px-8 md:px-10 py-10">
      {/* Breadcrumb */}
      <div className="text-xs text-zinc-500 mb-3 flex items-center gap-2">
        <a href="/welcome" className="min-h-[28px] inline-flex items-center px-1 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Welcome</a>
        <span className="mx-1">›</span>
        <a href="/new" className="min-h-[28px] inline-flex items-center px-1 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Activities</a>
        <span className="mx-1">›</span>
        <span className="min-h-[28px] inline-flex items-center px-1">{name}</span>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[32px] leading-[40px] font-semibold text-zinc-900">{name}</h1>
        <span className={`px-2.5 py-1 rounded-full text-sm ${status==='Draft'?'bg-indigo-50 text-indigo-700':'bg-zinc-100 text-zinc-700'}`}>{status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT: main (tabs) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-4 border-b border-zinc-200">
            <button className={`pb-2 text-sm ${activeTab==='collect'?'text-indigo-700 border-b-2 border-indigo-600':'text-zinc-600'}`} onClick={()=>setActiveTab('collect')}>Collect & share</button>
            <button className={`pb-2 text-sm ${activeTab==='settings'?'text-indigo-700 border-b-2 border-indigo-600':'text-zinc-600'}`} onClick={()=>setActiveTab('settings')}>Settings</button>
          </div>

          {activeTab==='collect' && (
            <div className="space-y-5">
              {/* Banner */}
              <div className={`text-sm rounded-lg px-3 py-2 border ${status==='Live'?'text-green-700 bg-green-50 border-green-200': status==='Closed'?'text-zinc-700 bg-zinc-100 border-zinc-300':'text-zinc-700 bg-zinc-50 border-zinc-200'}`}>
                {status==='Live' && 'Collecting responses — form is open.'}
                {status==='Draft' && 'Share the link or QR to start collecting submissions.'}
                {status==='Closed' && 'Activity is closed. Receipt is available below.'}
              </div>

              {/* Submissions */}
              <div className="border border-zinc-200 rounded-2xl p-6">
                <div className="text-[16px] font-semibold text-zinc-900 mb-2">Submissions</div>
                <div className="text-sm text-zinc-600">No submissions yet. Share the link or QR to start collecting.</div>
                <div className="mt-3">
                  <button className="text-sm text-indigo-700 hover:underline" onClick={()=>window.open(participantUrl, '_blank')}>Preview participant form</button>
                </div>
              </div>

              {/* Close & Receipt */}
              <div className="border border-zinc-200 rounded-2xl p-6">
                <div className="text-[16px] font-semibold text-zinc-900 mb-2">Close & Receipt</div>
                <Button variant="outline" disabled className="h-10">Close activity & generate CO₂ receipt</Button>
                <div className="mt-2">
                  <button className="text-sm text-indigo-700 hover:underline" onClick={()=>alert('Closing locks new submissions and generates a verified CO₂ receipt.')}>How closing works</button>
                </div>
              </div>
            </div>
          )}

          {activeTab==='settings' && (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-zinc-600 mb-1 block">Activity name</label>
                <Input value={name} onChange={(e)=>setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-zinc-600 mb-1 block">Start</label>
                  <Input type="datetime-local" value={start} onChange={(e)=>setStart(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm text-zinc-600 mb-1 block">End</label>
                  <Input type="datetime-local" value={end} onChange={(e)=>setEnd(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-600 mb-1 block">Location</label>
                <Input value={locationText} onChange={(e)=>setLocationText(e.target.value)} placeholder="Address" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-zinc-600 mb-1 block">Branch / Team (optional)</label>
                  <Input placeholder="Team name (optional)" />
                </div>
                <div>
                  <label className="text-sm text-zinc-600 mb-1 block">Region / Factor set</label>
                  <Input value={`${region} · ${factorSet}`} onChange={()=>{}} readOnly />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input id="ac" type="checkbox" checked={autoClose} onChange={(e)=>setAutoClose(e.target.checked)} />
                <label htmlFor="ac" className="text-sm text-zinc-700">Close automatically at end time</label>
              </div>
              <div className="flex items-center gap-4">
                <Button className="h-10">Save</Button>
                <Button variant="outline" className="h-10" onClick={()=>setStatus('Live')}>Go live</Button>
                <span className="text-xs text-zinc-500">You can share the link even in Draft; rules apply when Go live.</span>
              </div>
            </div>
          )}

          {/* Receipt block */}
          <div className="border border-zinc-200 rounded-2xl p-5">
            <h2 className="text-[16px] font-semibold text-zinc-900 mb-2">Receipt</h2>
            <div className="text-sm text-zinc-600">Receipt will be available after you close the activity.</div>
            <div className="mt-3">
              <Button variant="outline" disabled className="h-10">Close & generate CO₂ receipt</Button>
            </div>
            <div className="mt-2">
              <button className="text-sm text-indigo-700 hover:underline" onClick={()=>alert('Closing locks new submissions and generates a verified CO₂ receipt.')}>How closing works</button>
            </div>
          </div>
        </div>

        {/* RIGHT: sidebar */}
        <aside className="lg:col-span-1 space-y-5 lg:sticky lg:top-6 self-start">
          <div className="border border-zinc-200 rounded-2xl p-6">
            <h2 className="text-[16px] font-semibold text-zinc-900 mb-3">Share & QR</h2>
            <div className="flex items-center gap-2 mb-3">
              <Input readOnly value={participantUrl} className="flex-1" />
              <Button variant="outline" onClick={()=>copy(participantUrl)}>Copy</Button>
              <Button variant="outline" onClick={()=>window.open(participantUrl, '_blank')}>Open</Button>
            </div>
            <div className="text-xs text-zinc-500 mb-4">Share with your team. Participants submit evidence via this link.</div>
            <div className="flex items-center justify-center">
              <img src={qrSrc} alt="QR code to open participant form" className="w-[200px] h-[200px]" />
            </div>
            <div className="text-center text-xs text-zinc-500 mt-3">Scan to open participant form</div>
            <div className="text-center mt-3">
              <a href={qrSrc} download={`participant-${activityId}.png`} className="text-sm text-indigo-700 hover:underline">Download QR</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}


