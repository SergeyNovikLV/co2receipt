"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Trees, Cpu, Archive as ArchiveIcon, Shirt, Battery, Recycle, Info } from 'lucide-react'

function buildParticipantUrl(activityId: string, participantToken?: string) {
  return `/join/${activityId}?key=${participantToken || ''}`
}

export default function OrganizerSkin({ params }: any) {
  const activityId = params.id as string
  const [tokens, setTokens] = useState<any>(null)
  const [name, setName] = useState('Clean-up / Waste drive')
  const [nameEdited, setNameEdited] = useState(false)
  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')
  const [locationText, setLocationText] = useState('')
  const [region, setRegion] = useState('EU Baltics')
  const [factorSet, setFactorSet] = useState('v2025.1')
  const [autoClose, setAutoClose] = useState(true)
  const [status, setStatus] = useState<'Draft'|'Live'|'Closed'>('Draft')
  const [activeTab, setActiveTab] = useState<'collect'|'settings'>('settings')
  const [organizerEmail, setOrganizerEmail] = useState('')
  const [subtype, setSubtype] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`activityTokens:${activityId}`)
      if (raw) setTokens(JSON.parse(raw))
      const meta = localStorage.getItem(`activityMeta:${activityId}`)
      if (meta) {
        const m = JSON.parse(meta)
        if (m?.type === 'carpool') setName('Mobility switch day')
        if (m?.type === 'zerowaste') setName('Zero-waste event')
        if (m?.type === 'cleanup' && m?.subtype) {
          setSubtype(m.subtype)
          if (!nameEdited) setName(`Clean-up / ${cleanupLabel(m.subtype)}`)
        }
      }
    } catch {}
    if (!start) setStart(new Date().toISOString().slice(0,16))
    if (!end) { const d = new Date(); d.setDate(d.getDate()+7); setEnd(d.toISOString().slice(0,16)) }
  }, [activityId])

  const participantUrl = useMemo(() => buildParticipantUrl(activityId, tokens?.participantToken), [activityId, tokens])
  const isCreated = !!(tokens && tokens.participantToken)
  const meta = (() => { try { return JSON.parse(localStorage.getItem(`activityMeta:${activityId}`) || '{}') } catch { return {} } })()
  const type = meta?.type || 'cleanup'
  const copy = (text: string) => navigator.clipboard.writeText(text)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(participantUrl)}`

  const setupComplete = (name?.trim()?.length || 0) > 0 && !!start && !!end && (locationText?.trim()?.length || 0) > 0

  function cleanupLabel(key: string) {
    switch (key) {
      case 'outdoor': return 'Outdoor litter'
      case 'ewaste': return 'E-waste'
      case 'archive': return 'Archive / Storeroom purge'
      case 'textile': return 'Textile / Footwear'
      case 'batteries': return 'Batteries / Lamps'
      case 'deposit': return 'Deposit return'
      default: return 'Waste drive'
    }
  }

  const chooseSubtype = (key: string) => {
    setSubtype(key)
    try {
      const raw = localStorage.getItem(`activityMeta:${activityId}`) || '{}'
      const m = { ...JSON.parse(raw || '{}'), subtype: key }
      localStorage.setItem(`activityMeta:${activityId}`, JSON.stringify(m))
    } catch {}
    if (!nameEdited) setName(`Clean-up / ${cleanupLabel(key)}`)
  }

  const goLive = () => { setStatus('Live') }

  return (
    <div className="min-h-dvh bg-white">
      <div className="w-full max-w-[720px] mx-auto px-4 md:px-6 pt-10 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-500 mb-3">
          <ol className="flex items-center gap-2">
            <li><a href="/welcome" className="px-1 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Welcome</a></li>
            <li className="mx-1">›</li>
            <li><a href="/new" className="px-1 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Activities</a></li>
            <li className="mx-1">›</li>
            <li className="font-semibold text-zinc-900 px-1">{name}</li>
          </ol>
        </nav>

        {/* Title + stepper */}
        <div className="min-h-[96px]">
          <h1 className="text-[32px] leading-[40px] font-semibold text-zinc-900 inline-flex items-center gap-2">
            {name}
            <span className={`px-2.5 py-1 rounded-full text-xs ${status==='Draft'?'bg-zinc-100 text-zinc-700':'bg-green-50 text-green-700'}`}>{status}</span>
          </h1>
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-zinc-100 text-zinc-600 mt-2">Step 2 of 2 · Share</div>
        </div>

        {/* Tabs (visual only highlight) */}
        <div className="flex items-center gap-4 border-b border-zinc-200 mb-4">
          <button className={`pb-2 text-sm ${activeTab==='settings'?'text-indigo-700 border-b-2 border-indigo-600':'text-zinc-600'}`} onClick={()=>setActiveTab('settings')}>Setup</button>
          <button className={`pb-2 text-sm ${activeTab==='collect'?'text-indigo-700 border-b-2 border-indigo-600':'text-zinc-600'}`} onClick={()=>setActiveTab('collect')}>Share</button>
        </div>

        {activeTab==='settings' && (
          <div className="space-y-4">
            {type==='cleanup' && (
              <div>
                <label className="text-sm text-zinc-600 mb-2 block">Choose sub-type</label>
                <div role="radiogroup" aria-label="Clean-up sub-type" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {k:'outdoor', t:'Outdoor litter', d:'Street/park/beach cleanup', I: Trees},
                    {k:'ewaste', t:'E-waste', d:'Electronics collection', I: Cpu},
                    {k:'archive', t:'Archive / Storeroom purge', d:'Office cleanup', I: ArchiveIcon},
                    {k:'textile', t:'Textile / Footwear', d:'Clothing, shoes', I: Shirt},
                    {k:'batteries', t:'Batteries / Lamps', d:'Household hazardous', I: Battery},
                    {k:'deposit', t:'Deposit return', d:'Bottles/cans', I: Recycle},
                  ].map(o => (
                    <button
                      key={o.k}
                      role="radio"
                      aria-checked={subtype===o.k}
                      onClick={()=>chooseSubtype(o.k)}
                      onKeyDown={(e)=>{ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); chooseSubtype(o.k) }}}
                      className={`text-left border rounded-2xl p-4 flex items-start gap-3 min-h-[92px] ${subtype===o.k?'border-indigo-600 bg-indigo-50':'border-zinc-200 hover:bg-zinc-50'}`}
                    >
                      <o.I className="w-6 h-6 text-zinc-700 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[14px] text-zinc-900">{o.t}</div>
                        <div className="text-[12px] text-zinc-600">{o.d}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-zinc-600 mb-1 block">Activity name</label>
              <Input value={name} onChange={(e)=>{ setName(e.target.value); setNameEdited(true) }} />
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

            <div>
              <label className="text-sm text-zinc-600 mb-1 block">Organizer email</label>
              <Input type="email" value={organizerEmail} onChange={(e)=>setOrganizerEmail(e.target.value)} placeholder="name@company.com" />
            </div>

            <div className="flex items-center gap-2">
              <input id="ac" type="checkbox" checked={autoClose} onChange={(e)=>setAutoClose(e.target.checked)} />
              <label htmlFor="ac" className="text-sm text-zinc-700">Close automatically at end time</label>
            </div>
            <div className="rounded-md border border-indigo-100 bg-indigo-50 text-[12px] text-zinc-800 p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
              <span>At end time we’ll close the activity and automatically generate a CO₂ receipt. The organizer gets the receipt by email; participants receive a “thank you” with a link.</span>
            </div>

            {/* Sticky action bar */}
            <div className="sticky bottom-0 pt-3 pb-3 bg-white border-t border-zinc-200 flex items-center gap-2">
              <Button className="h-11" onClick={goLive}>Go live — Generate link & QR</Button>
              <Button variant="outline" className="h-11">Save draft</Button>
              <Button variant="ghost" className="h-11" onClick={()=>window.history.back()}>Cancel</Button>
            </div>
          </div>
        )}

        {activeTab==='collect' && (
          <div className="space-y-5">
            <div className={`text-sm rounded-lg px-3 py-2 border ${status!=='Live'?'text-amber-800 bg-amber-50 border-amber-200': !setupComplete?'text-amber-800 bg-amber-50 border-amber-200': 'text-zinc-700 bg-zinc-50 border-zinc-200'}`}>
              {status!=='Live' && 'Go live to enable sharing.'}
              {status==='Live' && !setupComplete && 'Complete Setup: name, start/end time, and location are required.'}
              {status==='Live' && setupComplete && 'Share the link or QR to start collecting submissions.'}
            </div>

            {/* Share panel (no primary CTA here) */}
            {status==='Live' && (
              <div className="space-y-3">
                <div className="relative">
                  <Input readOnly value={participantUrl} className="pr-10" />
                  <button aria-label="Copy link" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-zinc-100" onClick={()=>copy(participantUrl)}>
                    <Copy className="w-4 h-4 text-zinc-600" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={()=>alert('Preview would open a modal here.')}>Preview</Button>
                  <Button variant="outline" onClick={()=>{ const a=document.createElement('a'); a.href=qrSrc; a.download=`participant-${activityId}.png`; a.click() }}>Download QR</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


