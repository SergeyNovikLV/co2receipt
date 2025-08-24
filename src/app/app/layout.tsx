'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Leaf, ClipboardList, FileText, Menu, X, ChevronsLeft, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('sidebar.collapsed') : null
    if (stored === '1') setIsCollapsed(true)
    const handler = () => { if (window.innerWidth < 1024) setIsCollapsed(true) }
    handler()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const navItems = [
    { id: 'activities', label: 'Activities', icon: ClipboardList, href: '/app/activities' },
    { id: 'receipts', label: 'Receipts', icon: FileText, href: '/app/receipts' },
  ] as const

  const isActive = (href: string) => pathname?.startsWith(href)

  const onNav = (href: string) => {
    setMobileOpen(false)
    router.push(href)
  }

  return (
    <div className="grid min-h-dvh items-start grid-cols-[72px_1fr] bg-zinc-50">
      {/* Sidebar */}
      <aside className={`hidden md:flex sticky top-0 self-start h-[100dvh] overflow-y-auto border-r border-zinc-200/40 bg-white flex-col justify-between ${isCollapsed ? 'w-[72px]' : 'w-[260px] xl:w-[280px]'} z-20`}>
        <div className="p-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} mb-4`}>
            <button onClick={() => onNav('/app/activities')} className="flex items-center gap-2 cursor-pointer">
              <Leaf className="w-5 h-5 text-indigo-600" />
              {!isCollapsed && <span className="font-semibold">CO₂ Receipt</span>}
            </button>
          </div>

          <nav aria-label="Main" className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const selected = isActive(item.href)
              return (
                <button
                  key={item.id}
                  role="menuitem"
                  aria-current={selected ? 'page' : undefined}
                  onClick={() => onNav(item.href)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full h-11 flex items-center gap-3 px-3 rounded-[10px] text-sm cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${selected ? 'bg-zinc-50 text-zinc-900' : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50'}`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${selected ? 'text-indigo-600' : ''}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              )
            })}

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
            {navItems.map((item)=>{
              const Icon=item.icon
              const selected=isActive(item.href)
              return (
                <button key={item.id} onClick={()=>onNav(item.href)} className={`w-full h-11 flex items-center gap-3 px-3 rounded-[10px] text-sm cursor-pointer transition-colors ${selected?'text-indigo-700 bg-indigo-50':'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50'}`}>
                  <Icon className="w-5 h-5 flex-shrink-0"/>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 overflow-y-auto" style={{ maxHeight: '100dvh' }}>
        <div className="px-8 lg:px-10 py-8 max-w-[1200px] mx-auto">
          {children}
          {/* Logout at bottom left on mobile and sticky area */}
          <div className="md:hidden mt-8">
            <button
              onClick={() => { try { signOut({ redirect: false }) } catch {} finally { localStorage.removeItem('guest'); window.location.href = '/welcome' } }}
              className="inline-flex items-center gap-3 text-sm text-zinc-600 hover:text-zinc-800"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </div>
        </div>
      </div>
      {/* Sidebar footer logout */}
      <div className="hidden md:block fixed bottom-4 left-4">
        <button
          onClick={() => { try { signOut({ redirect: false }) } catch {} finally { localStorage.removeItem('guest'); window.location.href = '/welcome' } }}
          className="inline-flex items-center gap-3 text-sm text-zinc-600 hover:text-zinc-800"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  )
}


