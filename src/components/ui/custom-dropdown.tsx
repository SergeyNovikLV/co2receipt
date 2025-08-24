'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface CustomDropdownProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  label,
  className,
  disabled = false,
  required = false
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const selectedOption = options.find(option => option.value === value)
  const displayValue = selectedOption ? selectedOption.label : placeholder

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-[14px] leading-[20px] font-medium text-zinc-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "w-full h-11 rounded-lg border border-zinc-200 px-3 text-left text-[14px] leading-[20px] text-zinc-900 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
            "disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed",
            "hover:border-zinc-300 transition-colors",
            isOpen && "border-indigo-500 ring-2 ring-indigo-500"
          )}
        >
          <span className={cn(
            "block truncate",
            !selectedOption && "text-zinc-500"
          )}>
            {displayValue}
          </span>
          <ChevronDown 
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </button>

        {/* Dropdown menu - positioned below the field */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-zinc-500 text-center">
                No options available
              </div>
            ) : (
              <ul className="py-1">
                {options.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 transition-colors",
                        "focus:outline-none focus:bg-zinc-50",
                        option.value === value && "bg-indigo-50 text-indigo-700"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{option.label}</span>
                        {option.value === value && (
                          <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
