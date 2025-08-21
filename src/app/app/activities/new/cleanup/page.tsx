'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CleanupRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new routing structure
    router.replace('/app/activities/new/cleanup')
  }, [router])

  return (
    <div className="min-h-dvh bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-zinc-600">Redirecting to Clean-up form...</p>
      </div>
    </div>
  )
}
