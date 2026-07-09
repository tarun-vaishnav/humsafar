/**
 * Development-only structured logger. Never ships to production output.
 * All logs are gated on `env.isDev` so tree-shaking removes them from builds.
 */
import { env } from '@config/env'

const style = 'color:#DFBC5B;font-weight:600;'
const dim = 'color:#737373;'

const emit = (level, scope, args) => {
  if (!env.isDev) return
  // eslint-disable-next-line no-console
  const fn = console[level] || console.log
  fn(`%c[HumSafar]%c ${scope}`, style, dim, ...args)
}

export const logger = {
  info: (scope, ...args) => emit('info', scope, args),
  warn: (scope, ...args) => emit('warn', scope, args),
  error: (scope, ...args) => emit('error', scope, args),
  scope: (name) => ({
    info: (...args) => emit('info', name, args),
    warn: (...args) => emit('warn', name, args),
    error: (...args) => emit('error', name, args),
  }),
}

export default logger
