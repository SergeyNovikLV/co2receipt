'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Leaf, Shuffle, Package, Plus, ClipboardList } from 'lucide-react'

export default function ActivitiesPage() {
  const router = useRouter()
  const [activitiesTab, setActivitiesTab] = useState<'active'|'past'>('active')

  const templates = [
    {
      id: 'cleanup',
      icon: Leaf,
      title: 'Clean-up / Waste drive',
      description: 'Collect and verify waste diversion — get a CO₂ receipt.',
      microText: 'inputs: kg by fraction • participants • time • GPS · evidence: photos + ticket/receipt',
      active: true,
    },
    {
      id: 'carpool',
      icon: Shuffle,
      title: 'Mobility switch day',
      description: 'Count only avoided solo car trips. Switch to transit/bike/walk/carpool/remote.',
      microText: "inputs: participants' baseline & actual • distance (km) • trips · evidence: simple proof",
      active: true,
    },
    {
      id: 'zerowaste',
      icon: Package,
      title: 'Zero-waste event',
      description: 'Plan low-waste events; measure disposables avoided.',
      microText: 'inputs: attendees • catering • reusables/disposables · evidence: photos/receipts',
      active: true,
    }
  ]

  type Template = { id: 'cleanup'|'carpool'|'zerowaste'; icon: any; title: string; description: string; microText: string; active: boolean }
  const handleCreateActivity = async (template: Template) => {
    if (template.active) {
      try {
        const res = await fetch('/api/activities/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: template.id }),
        })
        if (!res.ok) throw new Error('Failed to create')
        const data = await res.json()
        try {
          localStorage.setItem(`activityTokens:${data.activityId}`, JSON.stringify(data))
          localStorage.setItem(`activityMeta:${data.activityId}`, JSON.stringify({ type: template.id }))
        } catch {}
        toast.success(`${template.title} created`)
        router.push(`/a/${data.activityId}?key=${data.organizerToken}`)
      } catch (error) {
        console.error('Error creating activity:', error)
        toast.error('Failed to create activity')
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-zinc-500 mt-6 -mb-4 flex items-center gap-2">
        <a href="/welcome" className="min-h-[28px] inline-flex items-center px-1 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Welcome</a>
        <span className="mx-1">›</span>
        <span className="min-h-[28px] inline-flex items-center px-1">Activities</span>
      </div>

      {/* Page Header */}
      <div className="pt-2">
        <h1 className="text-[32px] leading-[40px] font-semibold text-zinc-900">Activities</h1>
        <p className="text-[14px] leading-[20px] text-zinc-600 mt-2">Pick one to create an activity.</p>
      </div>

      {/* Templates */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleCreateActivity(template)}
              disabled={!template.active}
              role="button"
              aria-label={`Create ${template.title} activity`}
              className={`p-4 md:p-5 border border-zinc-200 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[120px] h-full bg-white ${
                template.active ? 'hover:bg-zinc-50 hover:border-zinc-300 cursor-pointer' : 'opacity-60 cursor-not-allowed'
              }`}
              title={!template.active ? "Coming soon - In active development. Pilot Q4/2025." : `Create new ${template.title.toLowerCase()} activity`}
              aria-disabled={!template.active}
            >
              <div className="flex items-start gap-2 h-full">
                <div className="flex-shrink-0">
                  <template.icon className={`w-5 h-5 ${template.active ? 'text-zinc-600' : 'text-zinc-400'}`} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <div>
                    <h3 className={`text-[16px] leading-[24px] font-semibold mb-2 ${template.active ? 'text-zinc-900' : 'text-zinc-600'}`}>{template.title}</h3>
                    <p className={`text-[14px] leading-[20px] line-clamp-2 ${template.active ? 'text-zinc-600' : 'text-zinc-500'}`}>{template.description}</p>
                  </div>
                  <div className="mt-3 text-[12px] leading-[16px] text-zinc-500 truncate">{template.microText}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-6">
        <div>
          <h2 className="text-[20px] leading-[28px] font-semibold text-zinc-900">Your activities</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActivitiesTab('active')}
            className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              activitiesTab === 'active' ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-600 hover:text-zinc-800'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActivitiesTab('past')}
            className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              activitiesTab === 'past' ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-600 hover:text-zinc-800'
            }`}
          >
            Past
          </button>
        </div>

        {/* Activities Table */}
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
            <h3 className="text-base font-semibold text-zinc-900">Activities</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {activitiesTab === 'active' ? (
              <div className="px-6 py-8 text-center">
                <ClipboardList className="w-5 h-5 text-zinc-400 mx-auto mb-3" />
                <h4 className="text-[16px] leading-[24px] font-medium text-zinc-900 mb-1">No active activities yet</h4>
                <p className="text-[14px] leading-[20px] text-zinc-600">Pick a template above to start.</p>
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <ClipboardList className="w-5 h-5 text-zinc-400 mx-auto mb-3" />
                <h4 className="text-[16px] leading-[24px] font-medium text-zinc-900 mb-1">No past activities yet</h4>
                <p className="text-[14px] leading-[20px] text-zinc-600">Past activities will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
