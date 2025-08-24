"use client"

import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

type EmptyProps = {
  title: string
  desc?: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

export default function Empty({ title, desc, actionLabel, onAction, icon }: EmptyProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center gap-3 py-16">
      {icon ? <div className="text-zinc-400">{icon}</div> : null}
      <div className="body-text text-zinc-900 font-medium">{title}</div>
      {desc ? <div className="small-text text-zinc-500">{desc}</div> : null}
      {actionLabel ? (
        <Button variant="outline" onClick={onAction} className="mt-2 cursor-pointer">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}



