'use client'

import { Button } from '@/components/ui/button'

export default function AttestPage({ params }: { params: { token: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Attestation</h1>
      <div className="space-y-2">
        <Button className="w-full min-h-11 text-base rounded-2xl">Saw in person</Button>
        <Button variant="secondary" className="w-full min-h-11 text-base rounded-2xl">Confirm facts</Button>
        <Button variant="outline" className="w-full min-h-11 text-base rounded-2xl">Disagree</Button>
      </div>
      <div>
        <input className="block w-full" type="file" accept="image/*" capture="environment" />
      </div>
    </div>
  )
}



