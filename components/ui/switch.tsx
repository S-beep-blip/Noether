// components/ui/switch.tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    id?: string
  }
>(({ className, checked, onCheckedChange, id, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked ?? false)

  const handleToggle = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    onCheckedChange?.(newChecked)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      aria-labelledby={id ? `${id}-label` : undefined}
      onClick={handleToggle}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffbd59] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isChecked ? "bg-[#ffbd59]" : "bg-gray-200",
        className
      )}
      ref={ref}
      id={id}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          isChecked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  )
})
Switch.displayName = "Switch"

export { Switch }