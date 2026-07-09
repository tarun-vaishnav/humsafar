# HumSafar Design System

> **LOCKED** — Every component, page, and future feature must follow this system.
> Do NOT deviate without updating this document first.

---

## Brand Identity

HumSafar is a **premium travel booking platform**.

The visual language communicates:
- **Trust** — Clean, reliable, professional
- **Warmth** — Inviting, human, approachable
- **Exploration** — Movement, discovery, adventure
- **Comfort** — Calm, spacious, breathable
- **Luxury** — Refined, elegant, premium

**NOT**: Cyber security, gaming, hacker dashboard, horror, sci-fi, dark mode.

---

## Color System

### Primary Palette (Light, Warm)
| Token | Hex | Usage |
|-------|-----|-------|
| `surface-base` | `#FAFAF8` | Page background — warm white |
| `surface-raised` | `#FFFFFF` | Cards, elevated surfaces |
| `surface-overlay` | `#F5F3EF` | Subtle sections, alternating bg |
| `content-primary` | `#1A1A1A` | Headlines, primary text |
| `content-secondary` | `#3D3D3D` | Body text |
| `content-tertiary` | `#6B6B6B` | Descriptions, captions |
| `content-muted` | `#9B9B9B` | Placeholders, disabled |

### Brand (Warm Coral)
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-DEFAULT` | `#E8735A` | Primary actions, active states |
| `brand-50` | `#FFF5F2` | Light tint backgrounds |
| `brand-400` | `#D95F4A` | Hover states |
| `brand-600` | `#C44B3A` | Pressed states |
| `brand-700` | `#A33D2F` | Deep emphasis |

### Accent (Travel Blue)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-DEFAULT` | `#4A90D9` | Secondary actions, links |
| `accent-50` | `#EFF6FF` | Light blue backgrounds |
| `accent-600` | `#2563EB` | Focus rings |

### Supporting
| Token | Hex | Usage |
|-------|-----|-------|
| `golden-DEFAULT` | `#D4A853` | Premium highlights, ratings |
| `golden-50` | `#FFFBEB` | Warning-light backgrounds |
| `forest-DEFAULT` | `#5B8C6A` | Success states, availability |
| `forest-50` | `#F0FDF4` | Positive-light backgrounds |

### Status
| Token | Hex | Usage |
|-------|-----|-------|
| `status-positive` | `#16A34A` | Success |
| `status-warning` | `#D97706` | Warnings |
| `status-danger` | `#DC2626` | Errors |
| `status-info` | `#2563EB` | Information |

### Forbidden Colors
- ❌ Neon purple
- ❌ Neon red / hot pink
- ❌ Cyber glow (any neon with blur)
- ❌ Gaming palette (electric blue, lime green)
- ❌ Dark backgrounds (#000, #0A0A, #111)
- ❌ `mix-blend-difference`

---

## Typography

| Role | Font | Weight | Size Token |
|------|------|--------|------------|
| Display | `var(--font-display)` | 300 (light) | `text-hero`, `text-display` |
| Headline | `var(--font-display)` | 300–400 | `text-headline` |
| Body | `var(--font-body)` | 300 (light) | `text-base`, `text-lg` |
| Caption/Label | `var(--font-body)` | 500 (medium) | `text-xs`, `text-sm` |
| Mono/Data | `var(--font-mono)` | 400 | `tabular-nums` |

### Sizes
```
hero:     clamp(3.5rem, 8vw, 7rem)
display:  clamp(2.5rem, 5vw, 4.5rem)
headline: clamp(1.5rem, 3vw, 2.5rem)
title:    clamp(1.25rem, 2vw, 1.75rem)
```

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `gutter` | `clamp(1.5rem, 4vw, 3rem)` | Page horizontal padding |
| `section` | `clamp(5rem, 12vw, 10rem)` | Section vertical padding |
| `gap-4` to `gap-16` | Standard Tailwind | Component spacing |

---

## Border Radius

| Usage | Value |
|-------|-------|
| Buttons | `rounded-full` (pill) |
| Cards | `rounded-2xl` (16px) |
| Inputs | `rounded-xl` (12px) |
| Badges/Tags | `rounded-full` |
| Small elements | `rounded-lg` (8px) |

---

## Shadows

| Token | Usage |
|-------|-------|
| `shadow-xs` | Subtle depth on inputs |
| `shadow-sm` | Light card elevation |
| `shadow-md` | Primary button resting |
| `shadow-lg` | Elevated cards on hover |
| `shadow-glow` | Brand accent glow (coral, subtle) |

**Rule**: Shadows must be warm-tinted (slight amber/coral), never cool blue or harsh black.

---

## Buttons

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| `primary` | `bg-brand` | White | None |
| `secondary` | `bg-surface-raised` | Primary text | `border-default` |
| `ghost` | Transparent | Primary text | `border-subtle` |
| `outline` | Transparent | Primary text | `border-strong` |
| `link` | Transparent | Link color | None (underline) |

All buttons use `rounded-full` (pill shape).

---

## Inputs

- Background: `bg-white`
- Border: `border-black/[0.08]`
- Hover: `border-black/[0.14]`
- Focus: `border-accent-600` + `ring-2 ring-accent-600/10`
- Radius: `rounded-xl`
- Text: `text-content-primary font-light`

---

## Cards

- Background: `bg-white`
- Border: `border-black/[0.06]`
- Hover border: `border-brand-DEFAULT/20`
- Radius: `rounded-2xl`
- Shadow: `shadow-xs` → `shadow-md` on hover
- Padding: `p-6` to `p-10`

---

## Animations

| Property | Duration | Easing |
|----------|----------|--------|
| Color/opacity transitions | `300ms` | `ease` |
| Layout shifts | `500ms` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Entrance animations | `800–1500ms` | `expo.out` |
| Background motion | `60–120s` | `linear` (very slow) |

**Rule**: Content first, animation second, background third. Animations enhance — never distract.

---

## Background

Premium travel-inspired. Light, subtle, never dominant.

- Soft topographic contour lines (SVG, low opacity)
- Elegant route curves
- Warm white → ivory gradients
- Very slow continuous motion (60–120s loops)
- Opacity: max 3–8% for decorative elements

**Forbidden**: Dark network grids, particle fields, neon glow effects, cyber patterns.

---

## Icons

- Style: Outline/line icons, `strokeWidth="1.5"`
- Size: 16px (inline), 20px (buttons), 24px (feature)
- Color: `currentColor` (inherits from text)
- Brand icon color: `#E8735A` (warm coral)

---

## Design Principles

1. **Content first** — The product is visible immediately
2. **Breathing room** — Generous whitespace, never cramped
3. **Warm & light** — Every element feels inviting
4. **Consistent** — Same tokens everywhere, no one-offs
5. **Accessible** — WCAG AA contrast ratios minimum
