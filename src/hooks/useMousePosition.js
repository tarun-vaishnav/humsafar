import { useEffect, useRef, useState } from 'react'
import { rafThrottle } from '@utils/timing'

/**
 * Track pointer position. Returns both a `state` (for re-renders when you need
 * them) and a `ref` (for animation loops that must not trigger re-renders).
 *
 * `normalized` is x/y mapped to [-1, 1] with center at origin — the shape most
 * three.js and shader code expects.
 */
export const useMousePosition = ({ normalized = true, subscribe = true } = {}) => {
  const [state, setState] = useState({ x: 0, y: 0, nx: 0, ny: 0 })
  const ref = useRef({ x: 0, y: 0, nx: 0, ny: 0 })

  useEffect(() => {
    const handler = rafThrottle((event) => {
      const { innerWidth: w, innerHeight: h } = window
      const x = event.clientX
      const y = event.clientY
      const nx = (x / w) * 2 - 1
      const ny = -((y / h) * 2 - 1) // flip so up is +y (three.js convention)

      ref.current.x = x
      ref.current.y = y
      ref.current.nx = nx
      ref.current.ny = ny

      if (subscribe) setState({ x, y, nx, ny })
    })

    window.addEventListener('pointermove', handler, { passive: true })
    return () => window.removeEventListener('pointermove', handler)
  }, [subscribe])

  return normalized ? { ...state, ref } : { x: state.x, y: state.y, ref }
}

export default useMousePosition
