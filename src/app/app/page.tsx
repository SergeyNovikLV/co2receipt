'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Leaf, Recycle, Car, Package, Search, Lock, ExternalLink, Download, FileText, ChevronRight, ClipboardList, Settings as SettingsIcon, Trophy, BadgeCheck, Plus, Menu, X, ChevronsLeft, User, Users, Upload, Clock, Award, TrendingUp, Shuffle } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Empty from '@/components/Empty'

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
    title: 'Reuse & Repair (Upcycling)',
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

// Real data will be fetched; keep no hardcoded demo rows
const recentReceiptsSeed: any[] = []

const seasonDataSeed: any[] = []

export default function AppPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const signedIn = Boolean(session)
  const role = (session as any)?.user?.role ?? (session as any)?.role ?? 'organizer'
  const userId = (session as any)?.user?.id ?? (session as any)?.id ?? 'me'
  const isOrganizer = role === 'organizer'
  const isParticipant = role === 'participant'
  const isWitness = role === 'witness'
  const isViewer = role === 'viewer'
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('activities')
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentReceipts, setRecentReceipts] = useState<any[]>(recentReceiptsSeed)
  const [seasonData, setSeasonData] = useState<any[]>(seasonDataSeed)
  const [queueItems, setQueueItems] = useState<any[]>([])
  const [orgStats, setOrgStats] = useState<{
    total_co2e_kg: number | null
    verified_count: number | null
    pending_count: number | null
  }>({
    total_co2e_kg: null,
    verified_count: null,
    pending_count: null
  })

  // Mock activities state - in real app this would come from API/database
  const [activities] = useState<any[]>([])
  const hasActivities = activities.length > 0
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activitiesTab, setActivitiesTab] = useState<'active'|'past'>('active')

  // Route guard: redirect to /welcome if no session and no guest
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const guest = localStorage.getItem('guest') === '1'
      if (!signedIn && !guest) {
        router.replace('/welcome')
      }
    }
  }, [signedIn, router])

  const canActOnReceipt = (r: any): boolean => {
    if (!userId) return false
    const fields = [
      r?.participants, r?.participantIds, r?.witnesses, r?.witnessIds, r?.assignees, r?.assignedToIds, r?.userIds
    ].filter(Boolean) as any[]
    return fields.some((list: any) => Array.isArray(list) && list.includes(userId))
  }

  const receiptsByRole = recentReceipts.filter((r: any) => {
    if (isOrganizer || isViewer) return true
    if (isParticipant || isWitness) return canActOnReceipt(r)
    return false
  })

  const filteredReceipts = receiptsByRole.filter((receipt: any) =>
    (receipt?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    // read tab from query (kept for backward compatibility)
    const tab = searchParams?.get('tab') as string | null
    setActiveTab(tab === 'activities' || tab === 'receipts' || tab === 'cup' ? tab : 'activities')
  }, [searchParams])

  useEffect(() => {
    // collapse by default on <1024
    const stored = typeof window !== 'undefined' ? localStorage.getItem('sidebar.collapsed') : null
    if (stored === '1') setIsCollapsed(true)
    const handler = () => { if (window.innerWidth < 1024) setIsCollapsed(true) }
    handler()
    window.addEventListener('resize', handler)
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed((v) => { localStorage.setItem('sidebar.collapsed', v ? '0' : '1'); return !v })
      }
    }
    window.addEventListener('keydown', keyHandler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    // Replace with real API calls when backend is connected
    async function load() {
      try {
        const res = await fetch('/api/receipts').catch(() => undefined)
        if (res?.ok) {
          const data = await res.json()
          setRecentReceipts(Array.isArray(data) ? data : [])
        }
      } catch {}

      try {
        const res = await fetch('/api/cup').catch(() => undefined)
        if (res?.ok) {
          const data = await res.json()
          setSeasonData(Array.isArray(data) ? data : [])
        }
      } catch {}

      try {
        const res = await fetch('/api/queue').catch(() => undefined)
        if (res?.ok) {
          const data = await res.json()
          setQueueItems(Array.isArray(data) ? data : [])
        }
      } catch {}
    }
    load()
  }, [])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'activities', label: 'Activities', icon: ClipboardList },
    { id: 'receipts', label: 'Receipts', icon: FileText },
    { id: 'cup', label: 'CO₂ Cup', icon: Trophy },
  ] as const

  const onNav = (id: string) => {
    if (id === 'dashboard') { router.push('/app/dashboard'); return }
    if (id === 'activities') { router.push('/app/activities'); return }
    if (id === 'receipts') { router.push('/app/receipts'); return }
    if (id === 'cup') { router.push('/app/cup'); return }
  }

  const tabLabel = activeTab === 'activities' ? 'Activities' : activeTab === 'cup' ? 'CO₂ Cup' : 'Receipts'

  return (
    <div className="grid min-h-dvh items-start grid-cols-[72px_1fr]">
      {/* Sidebar */}
      <aside className={`hidden md:flex sticky top-0 self-start h-[100dvh] overflow-y-auto border-r border-zinc-200/40 bg-white flex-col justify-between ${isCollapsed ? 'w-[72px]' : 'w-[260px] xl:w-[280px]'} z-20`}>
        <div className="p-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} mb-4`}>
            <button onClick={() => onNav('dashboard')} className="flex items-center gap-2 cursor-pointer">
              <Leaf className="w-5 h-5 text-indigo-600" />
              {!isCollapsed && <span className="font-semibold">CO₂ Receipt</span>}
            </button>
          </div>
          
          <nav aria-label="Main" className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const selected = item.id === activeTab
              return (
                <button
                  key={item.id}
                  role="menuitem"
                  aria-current={selected ? 'page' : undefined}
                  onClick={() => onNav(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full h-11 flex items-center gap-3 px-3 rounded-[10px] text-sm cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${selected ? 'text-indigo-700 bg-indigo-50' : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50'}`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${selected ? 'text-indigo-600' : ''}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              )
            })}
            
            {/* Collapse button below Profile with 60px margin top */}
            <div className="mt-[60px] flex justify-start">
              <button 
                onClick={() => { setIsCollapsed(v=>{const nv=!v; localStorage.setItem('sidebar.collapsed', nv?'1':'0'); return nv }) }} 
                className="w-8 h-8 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" 
                title={isCollapsed? 'Expand' : 'Collapse'}
              >
                <ChevronsLeft className={`w-4 h-4 m-auto transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </nav>
        </div>
        
        {/* Remove the old collapse button from bottom */}
      </aside>

      {/* Mobile hamburger */}
      <button className="md:hidden fixed left-3 top-[70px] z-30 bg-white/90 border border-zinc-200 rounded-md p-2 cursor-pointer" onClick={() => setMobileOpen(true)} aria-label="Open menu">
        <Menu className="w-5 h-5" />
      </button>
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[240px] bg-white border-r border-zinc-200/40 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="cursor-pointer"><X className="w-5 h-5"/></button>
            </div>
            {navItems.slice(0,3).map((item)=>{
              const Icon=item.icon as any
              const selected=item.id===activeTab
              return (
                <button key={item.id} onClick={()=>{setMobileOpen(false); onNav(item.id)}} className={`w-full h-11 flex items-center gap-3 px-3 rounded-[10px] text-sm cursor-pointer transition-colors ${selected?'text-indigo-700 bg-indigo-50':'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50'}`}>
                  <Icon className="w-5 h-5 flex-shrink-0"/>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main */}
      <div className="min-w-0 overflow-y-auto" style={{ maxHeight: '100dvh' }}>
        {/* Content */}
        <div className="px-8 lg:px-10 py-8">
          {/* Content Grid */}
          <div className="max-w-7xl mx-auto">
            {activeTab === 'activities' ? (
              <>
                {/* Top Actions Panel */}
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-2">
                    <h1 className="text-[32px] leading-[40px] font-semibold text-zinc-900">
                      {tabLabel}
                    </h1>
                    <p className="text-[14px] leading-[20px] text-zinc-600 mt-2">Pick one to create an activity.</p>
                  </div>
                </div>

                {/* Main content */}
                <div className="space-y-8">
                  {/* Templates — без внешней карточки */}
                  <div className="space-y-4">
                    <div />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          {
                            id: 'cleanup',
                            icon: Leaf,
                            title: 'Clean-up / Waste drive',
                            description: "Collect and verify waste diversion — get a CO₂ receipt.",
                            microText: "Inputs: kg by fraction • participants • time • GPS · Evidence: photos + ticket/receipt",
                            active: true
                          },
                          {
                            id: 'carpool',
                            icon: Shuffle,
                            title: 'Mobility switch day',
                            description: "Count only avoided solo car trips — switch to transit/bike/walk/carpool/remote.",
                            microText: "Inputs: participants' baseline & actual · distance (km) · trips · Evidence: simple proof",
                            active: true
                          },
                          {
                            id: 'zerowaste',
                            icon: Package,
                            title: 'Zero-waste event',
                            description: "Plan low-waste events; measure disposables avoided.",
                            microText: "Inputs: attendees • catering • reusables/disposables · Evidence: photos/receipts",
                            active: true
                          },
                        ].map((template) => (
                          <button
                            key={template.id}
                            onClick={async () => {
                              if (template.active) {
                                try {
                                  const response = await fetch('/api/activities/create', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ type: template.id }),
                                  })
                                  
                                  if (response.ok) {
                                    toast.success(`${template.title} created`)
                                    router.push(`/activities/${template.id}`)
                                  } else {
                                    toast.error('Failed to create activity')
                                  }
                                } catch (error) {
                                  console.error('Error creating activity:', error)
                                  toast.error('Failed to create activity')
                                }
                              }
                            }}
                            disabled={!template.active}
                            className={`p-6 border border-zinc-200 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 h-full bg-white shadow-sm ${
                              template.active 
                                ? 'hover:bg-zinc-50 hover:border-zinc-300 cursor-pointer' 
                                : 'opacity-60 cursor-not-allowed'
                            }`}
                            title={!template.active ? "Coming soon - In active development. Pilot Q4/2025." : `Create new ${template.title.toLowerCase()} activity`}
                            aria-disabled={!template.active}
                          >
                            <div className="flex items-start gap-3 h-full">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${template.active ? 'bg-indigo-50' : 'bg-zinc-200'}`}>
                                <template.icon className={`w-5 h-5 ${template.active ? 'text-indigo-600' : 'text-zinc-500'}`} />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className={`text-[18px] leading-[26px] font-semibold ${template.active ? 'text-zinc-900' : 'text-zinc-600'}`}>{template.title}</h3>
                                    {!template.active && (
                                      <span className="text-[12px] leading-[16px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2">
                                        Coming soon
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-[14px] leading-[20px] text-left ${template.active ? 'text-zinc-600' : 'text-zinc-500'}`}>
                                    {template.description}
                                  </p>
                                </div>
                                <div className="mt-3">
                                  {template.microText ? (
                                    <div className={`text-[12px] leading-[16px] text-left text-zinc-500 ${template.active ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                      {template.microText}
                                    </div>
                                  ) : (
                                    <div className="h-[32px]"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tabs + Activities table — как у тебя, но без внешнего bg-заливочного контейнера */}
                    <div>
                      {/* Active | Past tabs */}
                      <div className="flex items-center gap-1 mb-4">
                        <button
                          onClick={() => setActivitiesTab('active')}
                          className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${activitiesTab === 'active' ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-600 hover:text-zinc-800'}`}
                        >
                          Active
                        </button>
                        <button
                          onClick={() => setActivitiesTab('past')}
                          className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${activitiesTab === 'past' ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-800'}`}
                        >
                          Past
                        </button>
                      </div>

                      {/* Activities table */}
                      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                          <h3 className="text-[16px] leading-[24px] font-semibold text-zinc-900">Activities</h3>
                        </div>
                        <div className="divide-y divide-zinc-100">
                          {activitiesTab === 'active' ? (
                            <div className="px-6 py-8 text-center">
                              <div className="w-6 h-6 mx-auto mb-3 bg-zinc-100 rounded-full flex items-center justify-center">
                                <ClipboardList className="w-6 h-6 text-zinc-400" />
                              </div>
                              <h4 className="text-[16px] leading-[24px] font-medium text-zinc-900 mb-2">No active activities yet</h4>
                              <p className="text-[14px] leading-[20px] text-zinc-600">Pick a template above to start.</p>
                            </div>
                          ) : (
                            <div className="px-6 py-8 text-center">
                              <div className="w-6 h-6 mx-auto mb-3 bg-zinc-100 rounded-full flex items-center justify-center">
                                <ClipboardList className="w-6 h-6 text-zinc-400" />
                              </div>
                              <h4 className="text-[16px] leading-[24px] font-medium text-zinc-900 mb-2">No past activities yet</h4>
                              <p className="text-[14px] leading-[20px] text-zinc-600">Past activities will appear here</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
              <div className="grid grid-cols-12 gap-8">
                {/* Left Column - 8 cols */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                  {/* Top Actions Panel */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-2">
                      <h1 className="text-[32px] leading-[40px] font-semibold text-zinc-900">
                        {tabLabel}
                      </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {activeTab === 'receipts' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-10 rounded-lg"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Import evidence (ZIP)
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-10 rounded-lg"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Search */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        placeholder="Search receipts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Receipts table */}
                  <div className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-200/40 bg-zinc-50">
                      <h3 className="text-[16px] leading-[20px] font-semibold text-zinc-900">Recent Receipts</h3>
                    </div>
                    <div className="divide-y divide-zinc-200/40">
                      {filteredReceipts.length === 0 ? (
                        <div className="px-6 py-8 text-center text-zinc-500">
                          <p className="text-sm">Nothing here yet</p>
                          <p className="text-xs mt-1">New receipts will appear here</p>
                        </div>
                      ) : (
                        filteredReceipts.map((receipt) => (
                          <div key={receipt.id} className="px-6 py-4 flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-zinc-900">{receipt.name}</h4>
                              <p className="text-sm text-zinc-600">{receipt.date}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={receipt.status === 'Verified' ? 'default' : 'secondary'}>
                                {receipt.status}
                              </Badge>
                              <span className="text-sm text-zinc-600">{receipt.co2e}</span>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" title="Share">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Export">
                                  <Download className="w-4 h-4" />
                                </Button>
                                {canActOnReceipt(receipt) && (
                                  <Button variant="ghost" size="sm" title="Approve">
                                    <BadgeCheck className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - 4 cols */}
                <div className="col-span-12 lg:col-span-4">
                  <div className="lg:sticky lg:top-8 space-y-6">
                    {/* This section is now handled within the activities tab */}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cup' && (
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200/60 rounded-2xl p-6">
                  <h3 className="text-[16px] leading-[20px] font-semibold text-zinc-900 mb-4">CO₂ Cup</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-zinc-900">0</div>
                      <div className="text-sm text-zinc-600">This month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-zinc-900">0</div>
                      <div className="text-sm text-zinc-600">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-zinc-900">0</div>
                      <div className="text-sm text-zinc-600">Rank</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'registry' && (
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200/60 rounded-2xl p-6">
                  <h3 className="text-[16px] leading-[20px] font-semibold text-zinc-900 mb-4">Registry & Badge</h3>
                  <p className="text-[14px] leading-[20px] text-zinc-600">Registry and badge information will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



