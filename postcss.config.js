/**
 * PostCSS pipeline. Vite auto-loads this file (ESM), so we simply declare the
 * order of transforms:
 *
 *   1. Tailwind — expands `@tailwind` / `@apply` directives into real CSS,
 *      driven by `tailwind.config.js`.
 *   2. Autoprefixer — adds vendor prefixes based on browserslist targets.
 *
 * `cssnano` is intentionally omitted; Vite 8 already minifies via lightningcss
 * once the pipeline finishes.
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
