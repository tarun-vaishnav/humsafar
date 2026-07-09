import { Environment as DreiEnvironment } from '@react-three/drei'

/**
 * Wraps drei's Environment with app-wide defaults. Uses a lightweight preset
 * (sunset) instead of custom HDRIs so nothing extra ships in the first paint.
 *
 * Swap `preset` at runtime for narrative moments — e.g. `night` inside a hero
 * story about stargazing, `dawn` for the "beginning of the journey" section.
 */
export const Environment = ({ preset = 'sunset', background = false, blur = 0.6, ...rest }) => (
  <DreiEnvironment preset={preset} background={background} blur={blur} {...rest} />
)

export default Environment
