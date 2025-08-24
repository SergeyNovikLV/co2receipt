import React from 'react'

type Props = {
  left: React.ReactNode
  right?: React.ReactNode
}

export function PageShell({ left, right }: Props) {
  return (
    <div className="min-h-dvh bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-12 gap-6 pt-10 pb-16">
          <section className="col-span-12 lg:col-span-7 min-w-0">{left}</section>
          <aside className="col-span-12 lg:col-span-5 min-w-0">{right}</aside>
        </div>
      </div>
    </div>
  )
}


