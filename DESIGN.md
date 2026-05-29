# Design

## Color Palette

### Tienda (brand register)
- Background: `#FBF7F3` (cream, tinted warm)
- Surface: `#F5ECE2` (gray-100 / cream-dark)
- Accent: `#C8967A` (dusty rose / terracotta — `--pink`)
- Accent dark: `#a6795f` (hover state — `--pink-dark`)
- Text primary: `#2A1A0E` (warm dark brown — `--black`)
- Text secondary: `#8B6A54` (gray-600 / mauve)
- Text muted: `#C8A88C` (gray-400)
- Accent glow: `rgba(200,150,122,0.28)` (`--pink-glow`)
- Accent light: `rgba(200,150,122,0.09)` (`--pink-light`)

### Panel (product register)
- Sidebar background: `#0c0c17` (`--sb-bg`)
- Content background: `#f5f6fa` (`--bg`)
- Surface: `#ffffff` (`--surface`)
- Accent: `#E91E8C` (hot pink — `--pink`)
- Accent dark: `#c2187a` (`--pink-dark`)
- Accent glow: `rgba(233,30,140,0.3)` (`--pink-glow`)
- Text primary: `#0f172a` (`--text-1`)
- Text secondary: `#475569` (`--text-2`)
- Text muted: `#94a3b8` (`--text-3`)

## Typography

### Tienda
- Display: Cormorant Garamond (300, 400, 500, 600 — italic variants)
- Body: DM Sans (300, 400, 500, 600)
- Mono: DM Mono (400, 500) — prices, SKUs

### Panel
- Body + UI: DM Sans (300–700, optical size 9–40)
- Mono: DM Mono (400, 500) — values, codes, stats

## Motion

### Easing tokens (both surfaces)
```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);   /* UI interactions — strong ease-out */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* On-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* Sidebars, drawers, cart — iOS-like */
```

### Duration guidelines
| Element | Duration |
|---|---|
| Button press feedback (`:active`) | instant — no transition |
| Hover color / opacity | 150–180ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, cards | 200–300ms |
| Modals, drawers, sidebar | 280–320ms |
| Hero entrance, product image zoom | 400–500ms |

### Rules
- Enter: ease-out (starts fast → feels responsive)
- Drawers/sidebars: ease-drawer (iOS-like)
- On-screen movement: ease-in-out
- Constant motion (marquee): linear
- All UI animations < 300ms (except hero/marketing)
- Hover transforms guarded by `@media (hover: hover) and (pointer: fine)`
- `prefers-reduced-motion` disables animation-duration and transition-duration

## Interaction States

### Buttons (both surfaces)
- `:hover` — color/shadow change (no transform on touch)
- `:active` — `transform: scale(0.97)` (instant, physical feedback)
- `:disabled` — `opacity: 0.4; cursor: not-allowed`
- `:focus-visible` — ring in accent color

## Banned Patterns (never use)

- `border-left` or `border-right` > 1px as colored accent on cards/list-items/callouts
- `background-clip: text` + gradient (gradient text)
- Glassmorphism decoratively
- Hero-metric template (big number + small label + gradient accent)
- Identical card grids
- `transition: all` (specify exact properties)
- Easing `cubic-bezier(0.4, 0, 0.2, 1)` (Material ease-in-out — starts slow)

## Layout

### Tienda
- Max content width: 1400px, centered, `padding: 0 40px`
- Section vertical padding: 80px desktop, 60px mobile
- Product grid: 4 columns desktop, 2 columns mobile
- Hero: full viewport height minus header

### Panel
- Sidebar: 240px fixed left
- Content: remaining width, `padding: 22px`
- Stats grid: `repeat(auto-fill, minmax(175px, 1fr))`
- Topbar: 58px sticky

## Spacing Scale

Panel uses consistent spacing: 5, 8, 10, 12, 14, 18, 22px

## Radius

- Panel: `--radius-s: 6px`, `--radius: 10px`, `--radius-l: 14px`, `--radius-xl: 18px`
- Tienda: `--radius: 2px` (sharp, editorial); exceptions: modals 12px, product images 8px
