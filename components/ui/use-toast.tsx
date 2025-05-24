"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

interface ToastState extends ToastProps {
  id: string
  visible: boolean
}

const toastStore: {
  toasts: ToastState[]
  add: (toast: ToastProps) => void
  remove: (id: string) => void
} = {
  toasts: [],
  add: () => {},
  remove: () => {},
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([])

  useEffect(() => {
    toastStore.toasts = toasts
    toastStore.add = (toast: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { ...toast, id, visible: true }])

      if (toast.duration !== 0) {
        setTimeout(() => {
          toastStore.remove(id)
        }, toast.duration || 5000)
      }
    }
    toastStore.remove = (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }
  }, [toasts])

  if (toasts.length === 0) return <>{children}</>

  return (
    <>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-md max-w-md transform transition-all duration-300 ${
              toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            } ${
              toast.variant === "destructive"
                ? "bg-red-600 text-white"
                : "bg-white text-slate-800 border border-slate-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{toast.title}</h3>
                {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
              </div>
              <button onClick={() => toastStore.remove(toast.id)} className="ml-4 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export const toast = (props: ToastProps) => {
  toastStore.add(props)
}
