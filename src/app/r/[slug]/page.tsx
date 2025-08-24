'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Copy, Download, Lock, ChevronDown, ChevronRight, CheckCircle, Circle, FileText, Camera, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function PublicReceipt({ params }: { params: { slug: string } }) {
  const [isTechnicalExpanded, setIsTechnicalExpanded] = useState(false)
  const [isCalculatedExpanded, setIsCalculatedExpanded] = useState(false)
  const isVerified = true // Demo: true = Verified, false = Pending
  const isGuest = true // Demo: simulate guest user

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast(`${label} copied to clipboard`)
    })
  }

  return (
    <div className="max-w-[1040px] mx-auto p-6 overflow-x-hidden">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 px-3 hover:bg-zinc-100"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={20} className="text-zinc-600 mr-2" />
          Back
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg">
        {/* Hero Result */}
        <div className="px-6 py-8 border-b border-zinc-200">
          <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-2">
            {isVerified ? 'Verified impact receipt' : 'Impact receipt — Pending verification'}
          </h1>
          <p className="text-sm text-zinc-500 mb-4">Evidence-based record you can share.</p>
          
          {/* Activity header */}
          <div className="mb-6">
            <div className="text-lg font-semibold text-indigo-700 mb-1">
              <span className="text-zinc-900">Activity:</span> Cleanup at Mežaparks
            </div>
            <div className="text-sm text-zinc-500">12.08.2025 09:30–12:10 · Riga</div>
          </div>
          
          {/* Large number row */}
          <div className="flex items-baseline gap-3 mb-6">
            <div className="text-4xl md:text-5xl font-semibold text-zinc-900">123</div>
            <div className="text-xs text-zinc-500">kg CO₂e</div>
            <div className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md" title="Estimate of emissions avoided versus baseline. Not a carbon credit.">
              Avoided
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-900">Category: Waste (C5)</span>
              <span className="inline-block text-zinc-500 text-sm cursor-help relative group" style={{ fontSize: '14px' }}>
                ⓘ
                <span className="absolute bottom-full mb-2 px-3 py-2 bg-zinc-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-[200px] max-w-[300px] text-left z-10 pointer-events-none" style={{ left: '-12px' }}>
                  Category of emissions accounting used for ESG. 'Waste' = disposal & treatment. 'C5' is the audit code. Full notation in Technical details.
                  <div className="absolute top-full w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-zinc-800 pointer-events-none" style={{ left: 'calc(50% + 12px)' }}></div>
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-900">Evidence quality: Basic</span>
              <span className="inline-block text-zinc-500 text-sm cursor-help relative group" style={{ fontSize: '14px' }}>
                ⓘ
                <span className="absolute bottom-full mb-2 px-3 py-2 bg-zinc-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-[200px] max-w-[300px] text-left z-10 pointer-events-none" style={{ left: '-12px' }}>
                  Data quality for this receipt. Basic — photos/notes & simple counts. Weighed — weigh tickets or transport logs present. Used only for fair comparison on leaderboards; does not change the CO₂e number.
                  <div className="absolute top-full w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-zinc-800 pointer-events-none" style={{ left: 'calc(50% + 12px)' }}></div>
                </span>
              </span>
            </div>
          </div>

          {/* Human Equivalents */}
          <div className="bg-zinc-50 rounded-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-zinc-900">What this roughly means (avoided):</span>
                                                                                                                           <span className="inline-block text-zinc-500 text-sm cursor-help relative group" style={{ fontSize: '14px' }}>
                    ⓘ
                    <span className="absolute bottom-full mb-2 px-3 py-2 bg-zinc-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-[200px] max-w-[300px] text-left z-10 pointer-events-none" style={{ left: '-12px' }}>
                      Human-scale comparisons of the avoided CO₂e. They don't add new metrics; they translate the CO₂ figure into familiar units.
                      <div className="absolute top-full w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-zinc-800 pointer-events-none" style={{ left: 'calc(50% + 12px)' }}></div>
                    </span>
                  </span>
            </div>
            <div className="text-sm text-zinc-600 mb-2">
              <span title="Uses gasoline 2.31 kg CO₂/L and your fleet's L/100km.">🚗 ~53 km not driven</span> · <span title="2.31 kg CO₂ per litre of petrol (burned).">⛽ ~53 L gasoline not burned</span> · <span title="kWh using your region's grid factor (kg CO₂/kWh).">🔌 ~490 kWh grid electricity avoided</span> · <span title="Very rough. One mature tree ≈20 kg CO₂/year.">🌳 ~6.2 tree-years</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="px-6 py-8 space-y-8">
          {/* Approvals */}
          <div className="pt-8">
            <div className="border-t border-zinc-200/30 mb-6"></div>
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-zinc-900" title="Two confirmations make this receipt Verified. Roles: Organizer, Participant, Witness.">Approvals (2 of 3)</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 py-2">
                <CheckCircle size={16} className="text-indigo-600" />
                <span className="text-sm text-zinc-900">A.S. — Organizer</span>
                <span className="text-xs text-zinc-500 ml-auto">12.08.2025 12:15</span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <CheckCircle size={16} className="text-indigo-600" />
                <span className="text-sm text-zinc-900">J.D. — Participant</span>
                <span className="text-xs text-zinc-500 ml-auto">12.08.2025 12:18</span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <Circle size={16} className="text-zinc-400" />
                <span className="text-sm text-zinc-900">M.K. — Witness</span>
                <span className="text-xs text-zinc-500 ml-auto">Pending</span>
                <button className="text-xs text-indigo-700 hover:text-indigo-800 hover:underline cursor-pointer">
                  Send reminder
                </button>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="pt-8">
            <div className="border-t border-zinc-200/30 mb-6"></div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l-1.586 1.586a2 2 0 102.828 2.828L9.828 13H7v-3z" />
                </svg>
                <h3 className="text-sm font-semibold text-zinc-900" title="A single archive with all files used to support this receipt.">Evidence</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm text-indigo-700 hover:text-indigo-800 hover:underline cursor-pointer">
                  Open
                </button>
                <span className="text-zinc-300">|</span>
                <button className="text-sm text-indigo-700 hover:text-indigo-800 hover:underline cursor-pointer">
                  Download evidence (ZIP)
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm text-zinc-900">Photos (4) · Tickets/CSV (1) · Notes (1)</span>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-12 bg-zinc-100 rounded border flex items-center justify-center">
                <Camera size={16} className="text-zinc-400" />
              </div>
              <div className="w-12 h-12 bg-zinc-100 rounded border flex items-center justify-center">
                <FileText size={16} className="text-zinc-400" />
              </div>
              <div className="w-12 h-12 bg-zinc-100 rounded border flex items-center justify-center">
                <span className="text-xs text-zinc-500">+3</span>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="pt-8">
            <div className="border-t border-zinc-200/30 mb-6"></div>
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-zinc-900">Event details</h3>
            </div>
            <dl className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-zinc-500">Project/Program</dt>
                <dd className="text-sm text-zinc-900 col-span-2">Green Week 2025</dd>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-zinc-500">Organization/Branch</dt>
                <dd className="text-sm text-zinc-900 col-span-2">Acme Group — Riga</dd>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-zinc-500">Organizer</dt>
                <dd className="text-sm text-zinc-900 col-span-2">Anna Smith • anna@acme.com</dd>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-zinc-500">Participants</dt>
                <dd className="text-sm text-zinc-900 col-span-2">18</dd>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-zinc-500">Local date & time</dt>
                <dd className="text-sm text-zinc-900 col-span-2">12.08.2025 09:30–12:10</dd>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-zinc-500">Location name</dt>
                <dd className="text-sm text-zinc-900 col-span-2">Mežaparks, Riga</dd>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-zinc-500">GPS</dt>
                <dd className="text-sm text-zinc-900 col-span-2 flex items-center gap-2">
                                         <span className="font-mono gps-coordinates" title="Event coordinates; copied to clipboard for audit.">56.97, 24.12</span>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => copyToClipboard('56.97, 24.12', 'GPS coordinates')}>
                    <Copy size={12} />
                  </Button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Receipt checks */}
        <div className="px-6 py-6">
          <div className="border-t border-zinc-200/30 mb-6"></div>
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-semibold text-zinc-900">Receipt checks</h3>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 text-zinc-700 rounded">
              Double-count check: No overlap ✓
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 text-zinc-700 rounded">
              Weigh tickets: Not provided ○
            </div>
          </div>
        </div>

        {/* Technical Details - Full width at bottom */}
        <div className="px-6 py-8 border-t border-zinc-200">
          <div>
            <button
              onClick={() => setIsTechnicalExpanded(!isTechnicalExpanded)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-zinc-50 cursor-pointer"
            >
              {isTechnicalExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900">Technical details & sources</h3>
                  <span className="inline-block text-zinc-500 text-sm cursor-help relative group" style={{ fontSize: '14px' }}>
                    ⓘ
                    <span className="absolute bottom-full mb-2 px-3 py-2 bg-zinc-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-[200px] max-w-[300px] text-left z-10 pointer-events-none" style={{ left: '-12px' }}>
                      For transparency: methods, factor sources, hash, version history. This is not a financial audit.
                      <div className="absolute top-full w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-zinc-800 pointer-events-none" style={{ left: 'calc(50% + 12px)' }}></div>
                    </span>
                  </span>
                </div>
              </div>
            </button>
            
            {isTechnicalExpanded && (
              <div className="px-4 pb-4 space-y-6">
                {/* Method & Assumptions */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-900 mb-3">Method (plain English)</h4>
                  <p className="text-sm text-zinc-900 mb-3">
                    We converted collected bags of waste into kilograms using rule C5-A2 from factor set v2025.1 (community waste). Then we added transport and subtracted recycling credit if applicable.
                  </p>
                  <dl className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-sm text-zinc-500">Scope & rule</dt>
                      <dd className="text-sm text-zinc-500 col-span-2">
                        Scope 3 — C5; Bags→kg per rule 
                        <span className="font-mono">v2025.1-C5-A2</span>
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-sm text-zinc-500">Double-count check</dt>
                      <dd className="text-sm text-zinc-900 col-span-2">No matches near time/location</dd>
                    </div>
                  </dl>
                </div>

                {/* How we calculated */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-zinc-900">How we calculated</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Chart:</span>
                      <div className="flex border border-zinc-200 rounded-md overflow-hidden">
                        <button
                          onClick={() => {
                            localStorage.setItem('chartType', 'bar');
                            setIsCalculatedExpanded(true);
                          }}
                          className={`px-2 py-1 text-xs transition-colors ${
                            localStorage.getItem('chartType') !== 'donut' 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-white text-zinc-600 hover:bg-zinc-50'
                          }`}
                        >
                          Bar
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem('chartType', 'donut');
                            setIsCalculatedExpanded(true);
                          }}
                          className={`px-2 py-1 text-xs transition-colors ${
                            localStorage.getItem('chartType') === 'donut' 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-white text-zinc-600 hover:bg-zinc-50'
                          }`}
                        >
                          Donut
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {isCalculatedExpanded && (
                    <div className="space-y-4">
                      {/* Chart */}
                      <div className="flex justify-center">
                        {localStorage.getItem('chartType') === 'donut' ? (
                          <div className="relative w-32 h-32">
                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                                strokeLinecap="butt"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#4f46e5"
                                strokeWidth="8"
                                strokeDasharray={`${60 * 2.51} ${100 * 2.51}`}
                                strokeDashoffset="0"
                                className="transition-all duration-300"
                                strokeLinecap="butt"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#0ea5e9"
                                strokeWidth="8"
                                strokeDasharray={`${25 * 2.51} ${100 * 2.51}`}
                                strokeDashoffset={`-${60 * 2.51}`}
                                className="transition-all duration-300"
                                strokeLinecap="butt"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="8"
                                strokeDasharray={`${10 * 2.51} 2 2`}
                                strokeDashoffset={`-${85 * 2.51}`}
                                className="transition-all duration-300"
                                strokeLinecap="butt"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#eab308"
                                strokeWidth="8"
                                strokeDasharray={`${5 * 2.51} ${100 * 2.51}`}
                                strokeDashoffset={`-${95 * 2.51}`}
                                className="transition-all duration-300"
                                strokeLinecap="butt"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-semibold text-zinc-700">100%</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-3 bg-zinc-200 rounded-md overflow-hidden">
                            <div className="h-full flex">
                              <div className="bg-indigo-600" style={{ width: '60%' }}></div>
                              <div className="bg-sky-500" style={{ width: '25%' }}></div>
                              <div className="bg-green-500" style={{ width: '10%' }}></div>
                              <div className="bg-yellow-500" style={{ width: '5%' }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded">
                          <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div>
                          Collection 60%
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-sky-50 text-sky-700 text-xs rounded">
                          <div className="w-3 h-3 bg-sky-500 rounded-sm"></div>
                          Transport 25%
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                          <div className="w-3 h-3 bg-green-500 rounded-sm border-2 border-green-500 border-dashed"></div>
                          Recycling credit −10%
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">
                          <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                          Estimates 5%
                        </div>
                      </div>
                      
                      {/* Caption */}
                      <div className="text-xs text-zinc-500 text-center">
                        Breakdown shows where the CO₂ figure comes from; it does not change your result.
                      </div>
                    </div>
                  )}
                </div>

                {/* Integrity */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-900 mb-3">Integrity</h4>
                  <dl className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-sm text-zinc-500">Hash (SHA-256)</dt>
                      <dd className="text-sm text-zinc-900 col-span-2 flex items-center gap-2">
                        <span className="font-mono text-xs hash-text" title="Fingerprint of this receipt to prove no changes after publishing.">ae12f9c7...9bcd</span>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => copyToClipboard('ae12f9c7b8a3d5e1f2c4a6b9d0e8f1a2b5c7d9e3f4a1b8c2d6e9f0a4b7c1d5e8f2', 'Hash')}>
                          <Copy size={12} />
                        </Button>
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-sm text-zinc-500">Factor set</dt>
                      <dd className="text-sm text-zinc-900 col-span-2">
                        <a href="/factors/v2025.1" className="text-indigo-700 hover:text-indigo-800 hover:underline cursor-pointer" title="Public sources of emission factors (versioned). View sources and diff between versions.">
                          v2025.1 — View factors
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}