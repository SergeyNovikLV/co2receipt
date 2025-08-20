'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Leaf, Recycle, Car, Package, Search, Lock, ExternalLink, Download, FileText, ChevronRight } from 'lucide-react'
import { useSession } from 'next-auth/react'

const activities = [
  {
    id: 'cleanup',
    title: 'Clean-up',
    description: 'Location, participants, waste collected',
    icon: Leaf,
  },
  {
    id: 'carpool',
    title: 'Carpool day',
    description: 'Distance, passengers, fuel saved',
    icon: Car,
  },
  {
    id: 'upcycling',
    title: 'Upcycling',
    description: 'Materials reused, process type',
    icon: Recycle,
  },
  {
    id: 'zerowaste',
    title: 'Zero-waste event',
    description: 'Event type, waste avoided',
    icon: Package,
  },
]

const recentReceipts = [
  { id: 1, name: 'Community clean-up', status: 'Verified', co2e: '45 kg', date: '2025-08-12', verified: true },
  { id: 2, name: 'Office carpool week', status: 'Pending', co2e: '28 kg', date: '2025-08-10', verified: false },
  { id: 3, name: 'Beach cleanup', status: 'Verified', co2e: '67 kg', date: '2025-08-08', verified: true },
]

const seasonData = [
  { rank: 1, branch: 'Northside Branch', fairScore: 82.3, co2e: 123, quality: 1.2 },
  { rank: 2, branch: 'Downtown Office', fairScore: 76.8, co2e: 98, quality: 1.0 },
  { rank: 3, branch: 'Harbor District', fairScore: 71.2, co2e: 89, quality: 1.0 },
  { rank: 4, branch: 'Tech Campus', fairScore: 68.9, co2e: 78, quality: 1.0 },
  { rank: 5, branch: 'Green Valley', fairScore: 65.4, co2e: 71, quality: 1.0 },
]

export default function AppPage() {
  const { data: session } = useSession()
  const isOrganizer = (session as any)?.role === 'organizer'
  const [activeTab, setActiveTab] = useState('receipts')
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReceipts = recentReceipts.filter(receipt =>
    receipt.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-[1200px] mx-auto px-6 overflow-x-hidden">
      {/* Sticky Subheader */}
      <div className="sticky top-[60px] z-20 bg-white border-b border-zinc-200 -mx-6 px-6 py-3 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-semibold text-zinc-900">Workspace</h1>
            
            {/* Segment Control Tabs */}
            <div className="flex border-b border-zinc-200">
              {[
                { id: 'receipts', label: 'Receipts' },
                { id: 'cup', label: 'CO₂ Cup' },
                { id: 'registry', label: 'Registry & Badge' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium relative focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-indigo-700 border-b-2 border-indigo-600'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="min-h-11">
              <FileText size={16} className="mr-2" />
              Import EPK
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 min-h-11">
              New receipt
            </Button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - 8 cols */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {activeTab === 'receipts' && (
            <>
              {/* Templates */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-zinc-900 mb-2">Templates</h2>
                <p className="text-sm text-zinc-600 mb-6">Choose your activity type to start with the right form.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    {
                      id: 'cleanup',
                      icon: Leaf,
                      title: 'Clean-up',
                      description: "We'll ask: bags (or kg), participants, time, GPS"
                    },
                    {
                      id: 'carpool',
                      icon: Car,
                      title: 'Carpool day', 
                      description: "We'll ask: trips, km per trip, passengers"
                    },
                    {
                      id: 'upcycling',
                      icon: Recycle,
                      title: 'Upcycling',
                      description: "We'll ask: items, material, baseline vs new use"
                    },
                    {
                      id: 'zerowaste',
                      icon: Package,
                      title: 'Zero-waste event',
                      description: "We'll ask: attendees, catering, disposables avoided"
                    }
                  ].map((activity) => {
                    const Icon = activity.icon
                    const isSelected = selectedActivity === activity.id
                    return (
                      <button
                        key={activity.id}
                        onClick={() => setSelectedActivity(activity.id)}
                        className={`relative w-full h-24 p-4 border rounded-lg text-left transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/30'
                            : 'border-zinc-200 hover:bg-zinc-50'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                            <Icon size={16} className="text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-zinc-900">{activity.title}</h3>
                            <p className="text-xs text-zinc-500 mt-1">{activity.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                
                {selectedActivity && (
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Continue
                  </Button>
                )}
              </div>

              {/* Recent Receipts Table */}
              <div className="bg-white border border-zinc-200 rounded-lg">
                <div className="p-6 border-b border-zinc-200">
                  <h2 className="text-xl font-semibold text-zinc-900 mb-4">Recent receipts</h2>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                    <Input
                      placeholder="Search receipts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-200 text-left">
                        <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Name</th>
                        <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Status</th>
                        <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">CO₂e</th>
                        <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Date</th>
                        <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReceipts.map((receipt) => (
                        <tr key={receipt.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                          <td className="px-6 py-4 text-sm text-zinc-900">{receipt.name}</td>
                          <td className="px-6 py-4">
                            <Badge 
                              variant={receipt.verified ? "default" : "secondary"}
                              className={receipt.verified 
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                                : "bg-zinc-100 text-zinc-700 border-zinc-200"
                              }
                            >
                              {receipt.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-900">{receipt.co2e}</td>
                          <td className="px-6 py-4 text-sm text-zinc-600">{receipt.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={() => toast("Report pack generated")} className="cursor-pointer">
                                <Download size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={!isOrganizer}
                                onClick={() => isOrganizer ? toast("Approved") : toast("Requires sign-in")}
                                className={`relative ${!isOrganizer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {!isOrganizer && <Lock size={12} className="absolute -top-1 -left-1" />}
                                Approve
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'cup' && (
            <div className="space-y-6">
              <div className="bg-white border border-zinc-200 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-zinc-900 mb-2">CO₂ Cup Leaderboard</h2>
                <p className="text-sm text-zinc-600 mb-6">FairScore = verified CO₂e saved per head × Quality (1.0 or 1.2 with weigh tickets)</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Branch</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">FairScore</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">CO₂e</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Q×</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seasonData.map((item) => (
                        <tr key={item.rank} className="border-b border-zinc-100">
                          <td className="px-4 py-3 text-sm font-mono text-zinc-900">{item.rank}</td>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-900">{item.branch}</td>
                          <td className="px-4 py-3 text-lg font-semibold text-zinc-900">{item.fairScore}</td>
                          <td className="px-4 py-3 text-sm text-zinc-600">{item.co2e} kg</td>
                          <td className="px-4 py-3 text-sm text-zinc-600">×{item.quality}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'registry' && (
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-zinc-900 mb-6">Registry</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-zinc-200 rounded-lg p-4">
                    <div className="font-medium text-zinc-900 mb-2">Receipt #{i}</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-500">Hash:</span>
                        <span className="font-mono text-zinc-900 ml-1">ae12…b2e9</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Evidence:</span>
                        <span className="text-zinc-900 ml-1">EPK</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Attestations:</span>
                        <span className="text-zinc-900 ml-1">2/3</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - 4 cols */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Your Queue */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6">
            <h3 className="text-base font-semibold text-zinc-900 mb-4">Your queue</h3>
            
            {/* Queue Items */}
            <div className="space-y-3">
              {/* Sample queue items */}
              {[
                { name: 'Community clean-up', status: 'Verified', co2e: '45 kg', date: '2025-08-12', type: 'verified' },
                { name: 'Office carpool week', status: 'Pending', co2e: '28 kg', date: '2025-08-10', type: 'pending' },
                { name: 'Beach cleanup', status: 'Verified', co2e: '67 kg', date: '2025-08-08', type: 'verified' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-900 truncate">{item.name}</div>
                    <div className="text-xs text-zinc-500">{item.date}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge
                      className={item.status === 'Verified'
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-zinc-100 text-zinc-700 border-zinc-200"
                      }
                    >
                      {item.status}
                    </Badge>
                    <div className="text-xs text-zinc-500 min-w-0">{item.co2e}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty state message */}
            <div className="text-center py-6 text-sm text-zinc-500 border-t border-zinc-100 mt-4">
              <div className="mb-2">No receipts yet.</div>
              <button 
                onClick={() => document.querySelector('[data-quick-start]')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-indigo-700 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                Start with a guided demo →
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <div className="text-xs text-zinc-500 mb-1">Verified</div>
              <div className="text-2xl font-semibold text-zinc-900">24</div>
              <div className="w-full h-1 bg-zinc-100 rounded-sm mt-2">
                <div className="w-4/5 h-full bg-indigo-600 rounded-sm"></div>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <div className="text-xs text-zinc-500 mb-1">Pending</div>
              <div className="text-2xl font-semibold text-zinc-900">7</div>
              <div className="w-full h-1 bg-zinc-100 rounded-sm mt-2">
                <div className="w-1/3 h-full bg-indigo-600 rounded-sm"></div>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <div className="text-xs text-zinc-500 mb-1">CO₂e this month</div>
              <div className="text-2xl font-semibold text-zinc-900">342kg</div>
              <div className="w-full h-1 bg-zinc-100 rounded-sm mt-2">
                <div className="w-3/4 h-full bg-indigo-600 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Season Snapshot */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-zinc-900">CO₂ Cup</h3>
              <button className="text-sm text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer">
                View full table
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {seasonData.slice(0, 5).map((item) => (
                <div key={item.rank} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-zinc-500">#{item.rank}</span>
                    <span className="text-sm text-zinc-900">{item.branch}</span>
                  </div>
                  <div className="text-sm font-semibold text-zinc-900">{item.fairScore}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6">
            <h3 className="text-base font-semibold text-zinc-900 mb-4">Quick links</h3>
            <div className="space-y-3">
              <button className="w-full text-left text-sm text-indigo-700 hover:text-indigo-800 flex items-center justify-between cursor-pointer">
                Registry & Badge
                <ExternalLink size={14} />
              </button>
              <button className="w-full text-left text-sm text-indigo-700 hover:text-indigo-800 flex items-center justify-between cursor-pointer">
                Export CSV
                <Download size={14} />
              </button>
              <button className="w-full text-left text-sm text-indigo-700 hover:text-indigo-800 flex items-center justify-between cursor-pointer">
                Factor set v2025.1
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom spacing for footer */}
      <div className="h-8"></div>
    </div>
  )
}



