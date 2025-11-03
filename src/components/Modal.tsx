import { useEffect } from "react"
import type { ReactNode } from "react"

type Props = {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
  maxWidthClass?: string // e.g., "max-w-md"
}

export default function Modal({ open, title, onClose, children, maxWidthClass = "max-w-md" }: Props) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* background overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      {/* modal content */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidthClass} bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-6`}
      >
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
