"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Leaf } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const isOnWorkspace = pathname === '/app'
  const hasGoogle = Boolean(process.env.NEXT_PUBLIC_GOOGLE_ENABLED || (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET))
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b">
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-indigo-600" />
          <Link href="/" className="font-semibold cursor-pointer">CO₂ Receipt</Link>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {!isOnWorkspace && (
            <Link href="/app" className="text-[15px] text-zinc-600 hover:text-indigo-700 transition-colors cursor-pointer">
              Skip to app
            </Link>
          )}
          {!session ? (
            hasGoogle ? (
              <Link href="#" onClick={() => signIn('google', { callbackUrl: typeof window !== 'undefined' ? window.location.href : '/' })} className="text-[15px] text-zinc-600 hover:text-indigo-700 transition-colors cursor-pointer">Sign in</Link>
            ) : (
              <span className="text-[15px] text-zinc-400" title="Requires Google keys">
                Sign in
              </span>
            )
          ) : (
            <Link href="#" onClick={() => signOut({ callbackUrl: '/' })} className="text-[15px] text-zinc-600 hover:text-indigo-700 transition-colors cursor-pointer">Sign out</Link>
          )}
        </div>
      </div>
    </header>
  )
}



