import { forwardRef, useId } from 'react'
import { cn } from '@utils/cn'

/**
 * Accessible form input. Handles label, hint, and error text with proper
 * `aria-describedby` / `aria-invalid` wiring.
 */
export const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    id,
    type = 'text',
    className,
    inputClassName,
    required,
    ...rest
  },
  ref,
) {
  const reactId = useId()
  const inputId = id ?? `input-${reactId}`
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-content-secondary">
          {label}
          {required && <span className="ml-1 text-status-danger">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required={required}
        className={cn(
          'h-11 w-full rounded-lg border bg-surface-raised px-4 text-base text-content-primary',
          'placeholder:text-content-muted transition-colors duration-base ease-smooth',
          'focus:outline-none focus:border-border-focus',
          error ? 'border-status-danger' : 'border-border-default',
          inputClassName,
        )}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-content-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-status-danger">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
