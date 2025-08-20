'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

function Dot({ active }: { active?: boolean }) {
  return (
    <span className={`h-1.5 w-8 rounded-full ${active ? 'bg-indigo-600' : 'bg-muted'}`} />
  )
}

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="min-h-11 rounded-2xl">
          <Link href="/">Back</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Dot active />
          <Dot />
          <Dot />
          <Button variant="ghost" asChild className="min-h-11 rounded-2xl">
            <Link href="/app">Skip</Link>
          </Button>
          <Button asChild className="min-h-11 rounded-2xl">
            <Link href="/app">Next</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <section className="rounded-3xl ring-1 ring-muted bg-white p-4 md:p-6 lg:p-8">
          <h2 className="text-2xl font-semibold">From action → verifiable CO₂ receipt</h2>
          <ul className="mt-4 text-sm md:text-base list-disc pl-5 space-y-1">
            <li>Immutable hash</li>
            <li>Evidence Pack (EPK zip)</li>
            <li>2-of-3 attestations</li>
          </ul>
        </section>
        <section className="rounded-3xl ring-1 ring-muted bg-white p-4 md:p-6 lg:p-8">
          <h2 className="text-2xl font-semibold">Motivation & utility</h2>
          <ul className="mt-4 text-sm md:text-base list-disc pl-5 space-y-1">
            <li>CO₂ Cup (FairScore) preview</li>
            <li>1-click Report Pack</li>
            <li>Public trust badge</li>
          </ul>
        </section>
      </div>
    </div>
  )
}



