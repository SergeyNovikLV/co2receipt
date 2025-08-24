'use client'

import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  required?: boolean
  className?: string
}

export function DateInput({ 
  label, 
  required, 
  className, 
  ...props 
}: DateInputProps) {
  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="block text-[14px] leading-[20px] font-medium text-zinc-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          className={cn(
            "w-full h-11 rounded-lg border border-zinc-200 px-3 pr-10 text-[14px] leading-[20px] text-zinc-900 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
            "disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed",
            "hover:border-zinc-300 transition-colors"
          )}
          {...props}
        />
        <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
      </div>
    </div>
  )
}
