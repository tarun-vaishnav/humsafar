import { forwardRef, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@utils/cn'
import { lockBodyScroll, unlockBodyScroll } from '@utils/dom'
import { stopScroll, startScroll } from '@animations/scroll'

/**
 * Accessible modal dialog.
 *
 * — Portals to `<body>` (no z-index conflicts).
 * — Locks page scroll (both Lenis and native).
 * — Restores focus to the trigger on close.
 * — Closes on ESC.
 *
 * State is fully controlled: parent owns `open` and provides `onClose`.
 */
export const Modal = forwardRef(function Modal(
  { open, onClose, title, description, size = 'md', className, children },
  ref,
) {
  const rId = useId()
  const titleId = `modal-title-${rId}`
  const descId = description ? `modal-desc-${rId}` : undefined
  const previouslyFocused = useRef(null)
  const surfaceRef = useRef(null)

  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement
    lockBodyScroll()
    stopScroll()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)

    // Move focus into the modal on the next tick so screen readers announce it.
    const id = requestAnimationFrame(() => surfaceRef.current?.focus())

    return () => {
      document.removeEventListener('keydown', onKey)
      cancelAnimationFrame(id)
      unlockBodyScroll()
      startScroll()
      previouslyFocused.current?.focus?.()
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={descId}
          className="fixed inset-0 z-modal flex items-center justify-center p-gutter"
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={surfaceRef}
            tabIndex={-1}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative z-raised w-full rounded-2xl bg-surface-raised border border-border-default',
              'shadow-2xl p-8 focus:outline-none',
              sizes[size],
              className,
            )}
          >
            {title && (
              <h2 id={titleId} className="font-display text-2xl mb-2">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="text-sm text-content-tertiary mb-4">
                {description}
              </p>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
})

export default Modal
