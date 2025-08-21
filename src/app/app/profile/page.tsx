'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { User, Mail, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const signedIn = Boolean(session)

  if (!signedIn) {
    return (
      <div className="min-h-dvh bg-white">
        <div className="max-w-2xl mx-auto px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-zinc-900 mb-4">Profile</h1>
            <p className="text-zinc-600 mb-6">Please sign in to view your profile.</p>
            <Button onClick={() => signOut()}>Sign In</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-white">
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="bg-white border border-zinc-200 rounded-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900">Profile</h1>
              <p className="text-zinc-600">Manage your account settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg">
              <Mail className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-sm font-medium text-zinc-900">Email</p>
                <p className="text-sm text-zinc-600">{session?.user?.email || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg">
              <User className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-sm font-medium text-zinc-900">Name</p>
                <p className="text-sm text-zinc-600">{session?.user?.name || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg">
              <Calendar className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-sm font-medium text-zinc-900">Member since</p>
                <p className="text-sm text-zinc-600">Recently</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-200">
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
