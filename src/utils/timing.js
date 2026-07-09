/**
 * Timing helpers — debounce, throttle, rAF-throttle, sleep.
 * Kept dependency-free so they can be used in workers if needed.
 */

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const debounce = (fn, wait = 200) => {
  let timeout
  const debounced = (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), wait)
  }
  debounced.cancel = () => clearTimeout(timeout)
  return debounced
}

export const throttle = (fn, wait = 100) => {
  let last = 0
  let timeout
  return (...args) => {
    const now = Date.now()
    const remaining = wait - (now - last)
    if (remaining <= 0) {
      clearTimeout(timeout)
      last = now
      fn(...args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        last = Date.now()
        timeout = null
        fn(...args)
      }, remaining)
    }
  }
}

/**
 * rAF-throttled callback. The invocation is deferred until the next animation
 * frame; if the source fires multiple times before that frame, only the latest
 * args survive. Great for pointer / scroll handlers.
 */
export const rafThrottle = (fn) => {
  let frame = null
  let pendingArgs = null
  return (...args) => {
    pendingArgs = args
    if (frame !== null) return
    frame = requestAnimationFrame(() => {
      frame = null
      fn(...pendingArgs)
      pendingArgs = null
    })
  }
}
