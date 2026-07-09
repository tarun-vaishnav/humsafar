import { useEffect, useState } from 'react'
import { rafThrottle } from '@utils/timing'
import { setCssVar } from '@utils/dom'

/**
 * Track viewport dimensions and publish `--vh` / `--vw` CSS custom properties
 * so mobile browsers' shrinking URL bar can't break `100vh` layouts.
 *
 * The returned state also exposes a coarse breakpoint token for logic-heavy
 * responsive code that can't rely purely on Tailwind classes.
 */
const getSize = () => ({
  width: typeof window === 'undefined' ? 0 : window.innerWidth,
  height: typeof window === 'undefined' ? 0 : window.innerHeight,
})

const getBreakpoint = (w) => {
  if (w < 640) return 'xs'
  if (w < 768) return 'sm'
  if (w < 1024) return 'md'
  if (w < 1280) return 'lg'
  if (w < 1536) return 'xl'
  return '2xl'
}

export const useViewport = () => {
  const [size, setSize] = useState(getSize)

  useEffect(() => {
    const publish = () => {
      const { innerWidth: w, innerHeight: h } = window
      setCssVar('--vh', `${h * 0.01}px`)
      setCssVar('--vw', `${w * 0.01}px`)
    }

    const update = rafThrottle(() => {
      setSize(getSize())
      publish()
    })

    publish()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return {
    width: size.width,
    height: size.height,
    aspect: size.height === 0 ? 1 : size.width / size.height,
    breakpoint: getBreakpoint(size.width),
    isPortrait: size.height >= size.width,
  }
}

export default useViewport
