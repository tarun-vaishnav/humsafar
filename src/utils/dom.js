/**
 * DOM helpers. All are SSR-safe.
 */

const hasDoc = typeof document !== 'undefined'

export const $ = (selector, root = hasDoc ? document : null) =>
  root ? root.querySelector(selector) : null

export const $$ = (selector, root = hasDoc ? document : null) =>
  root ? Array.from(root.querySelectorAll(selector)) : []

export const setCssVar = (name, value, el = hasDoc ? document.documentElement : null) => {
  if (!el) return
  el.style.setProperty(name.startsWith('--') ? name : `--${name}`, value)
}

export const getCssVar = (name, el = hasDoc ? document.documentElement : null) => {
  if (!el) return ''
  return getComputedStyle(el).getPropertyValue(name.startsWith('--') ? name : `--${name}`).trim()
}

export const lockBodyScroll = () => {
  if (!hasDoc) return
  document.documentElement.classList.add('lenis-stopped')
}

export const unlockBodyScroll = () => {
  if (!hasDoc) return
  document.documentElement.classList.remove('lenis-stopped')
}

export const measureScrollbar = () => {
  if (!hasDoc) return 0
  const outer = document.createElement('div')
  outer.style.cssText = 'position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll;'
  document.body.appendChild(outer)
  const inner = document.createElement('div')
  outer.appendChild(inner)
  const width = outer.offsetWidth - inner.offsetWidth
  outer.remove()
  return width
}
