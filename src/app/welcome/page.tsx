"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // If already logged in (placeholder check) redirect to app
    const hasSession = typeof window !== 'undefined' && (localStorage.getItem('guest') === '0' || localStorage.getItem('sb-access-token'))
    if (hasSession) router.replace('/app?tab=activities')
  }, [router])

  const skip = () => {
    localStorage.setItem('guest','1')
    router.replace('/app?tab=activities')
  }

  const handleSendLink = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      setSuccess('')
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // TODO: Implement magic link
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSuccess('Magic link sent to you. Check inbox.')
    } catch (err) {
      setError('Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendLink()
    }
  }

  return (
    <div className="min-h-dvh bg-white flex items-center justify-center">
      <div className="max-w-[1200px] w-full px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left column - auth */}
          <div className="max-w-[380px] w-full space-y-4 lg:ml-auto mr-[60px]">
            <div className="space-y-3">
              <h1 className="text-[32px] leading-[38px] font-semibold text-zinc-900">
                Turn action into proof
              </h1>
              <p className="text-[15px] leading-[22px] text-zinc-600">
                Measure, verify, and share environmental impact in minutes.
              </p>
            </div>

            {/* Social buttons */}
            <div className="space-y-3">
              <Button 
                variant="outline"
                className="h-12 rounded-2xl w-full inline-flex items-center justify-center gap-3 font-medium bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Continue with Google"
              >
                <svg className="w-5 h-5 opacity-100" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.2-4.74 3.2-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button 
                className="h-12 rounded-2xl w-full inline-flex items-center justify-center gap-3 font-medium bg-[#1877F2] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Continue with Facebook"
              >
                <svg className="w-5 h-5 opacity-100" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
              
              <p className="text-xs text-zinc-400">
                We never post to Google or Facebook.
              </p>
            </div>

            {/* Divider */}
            <div className="relative h-px bg-zinc-200 my-2">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-2 text-xs text-zinc-400">or</span>
            </div>

            {/* Email + Send */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Input 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 h-12 rounded-2xl border border-zinc-300 px-4 text-[15px] placeholder:text-zinc-400"
                />
                <Button 
                  onClick={handleSendLink}
                  disabled={!email || !email.includes('@') || isLoading}
                  className="h-12 px-4 rounded-2xl bg-indigo-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    'Send link'
                  )}
                </Button>
              </div>
              
              {/* Status messages */}
              {success && (
                <div role="status" className="text-sm text-emerald-600">
                  Magic link sent. Check your inbox.
                </div>
              )}
              {error && (
                <div role="alert" className="text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            {/* Skip button */}
            <Button 
              variant="outline" 
              onClick={skip}
              className="h-12 rounded-2xl w-full border border-zinc-300 bg-white text-zinc-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Skip for now
            </Button>

            {/* Legal */}
            <p className="text-xs text-zinc-400">
              By continuing you agree to our{' '}
              <a href="#" className="underline text-zinc-500 hover:text-zinc-700">Terms</a>
              {' '}and{' '}
              <a href="#" className="underline text-zinc-500 hover:text-zinc-700">Privacy</a>.
            </p>
          </div>

          {/* Right column - visual */}
          <div className="hidden lg:block">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-indigo-50 to-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] flex items-center justify-center">
              <span className="text-zinc-400 text-sm">Image Placeholder 4:3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


