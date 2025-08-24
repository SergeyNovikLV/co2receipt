"use client"

import Header from "@/components/Header"
import { usePathname } from "next/navigation"
import React from "react"

export default function LayoutFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isApp = pathname?.startsWith("/app")
  const isWelcome = pathname === "/welcome"
  const isReceipt = pathname?.startsWith("/r")

  return (
    <div className="min-h-[100svh] bg-white flex flex-col overflow-x-hidden">
      {!isApp && !isWelcome && !isReceipt && <Header />}
      <main className="flex-1 overflow-x-hidden">{children}</main>
      {!isApp && !isWelcome && !isReceipt && (
        <footer className="border-t mt-auto">
          <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-6 text-xs text-muted-foreground flex items-center justify-between">
            <span>© {new Date().getFullYear()} CO₂ Receipt</span>
            <div className="text-[11px] font-medium">Factor Set v2025.1</div>
          </div>
        </footer>
      )}
    </div>
  )
}


