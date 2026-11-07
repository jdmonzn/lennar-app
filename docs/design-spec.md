# Design Spec — Responsive Hero Section

Transcribed from the candidate brief (design-specs-len-challenge.netlify.app) and the Figma file.
Figma: https://www.figma.com/design/6i6iV7U8iaZRQy0vW8J4TP/responsive-web-ui-task
All four breakpoint frames share identical component structure and copy. Only widths, column sizing, form orientation (horizontal vs stacked) and heading sizes differ.

## Breakpoints

| Frame | Width | Layout |
|---|---|---|
| Mobile | 376px | Single column. Stacked form (input above button). Menu collapsed/open states. Illustration below content. |
| Tablet | 834px | Two columns: content left, illustration right. Full horizontal nav. Container flush to edges. |
| Laptop | 1080px | Two columns: content 492px, illustration 492px. Horizontal form. Centered container. |
| Desktop | 1358px | Inner container max-width 1280px, centered. Side padding 39px. Content 592px, illustration 592px. |

## Color tokens (exact hex)

| Token | Hex | Usage |
|---|---|---|
| gray-900 | #111827 | Page background, dark nav background |
| gray-700 | #374151 | Mobile menu link text |
| gray-600 | #4B5563 | Nav "Start free trial" button background |
| gray-500 | #6B7280 | Input placeholder |
| gray-400 | #9CA3AF | Menu / close icon stroke (exported asset) |
| gray-300 | #D1D5DB | Body / supporting text, helper text |
| indigo-400 | #818CF8 | Heading highlight ("ship web apps") |
| indigo-500 | #6366F1 | Submit button, badge, accent, logo mark |
| indigo-600 | #4F46E5 | Mobile menu CTA button |
| white | #FFFFFF | Nav links, heading, input background |
| black | #000000 | Callout pill background |

## Typography (all Inter) — verified in Figma Inspect

Letter spacing values are **percent of font size** (Figma %), not px. -2.5% = `-0.025em`, -4% = `-0.04em`, 2.5% = `0.025em`.

| Role | Mobile (376) | Tablet (834) | Laptop (1080) | Desktop (1358) |
|---|---|---|---|---|
| Display heading (800) | 36px / 40px · -2.5% | 48px / 48px · -4% | 60px / 60px · -2.5% | 72px / 72px · 0% |
| Supporting body (400) | 16px / 24px | 18px / 28px | 20px / 28px | 24px / 28px |
| Nav link · button text | 500 · 16px / 24px | same | same | same |
| Helper · legal copy | 400 · 14px / 20px | same | same | same |
| Badge ("We're hiring") | 500 · 12px / 20px · +2.5% · uppercase | same | same | same |

## Navbar

- Total height 66px; container top padding 24px
- Logo: 43.75 × 40px desktop, 35 × 32px mobile; on mobile, 16px from the left edge
- Gap between nav links: 32px
- Trailing group ("Log in" link + "Start free trial" button), gap 24px
- Nav button: background gray-600, padding 9px 17px, radius 6px, height 42px, text white 16px/500
- Mobile: hamburger trigger with a 40 × 40px tap target, right-aligned (320px from left in the 376 frame)

## Hero section

- Section top padding 32px
- Content top offset (callout) 96px
- Gaps: callout → heading 24px · heading → body 20px · body → form 48px
- Illustration height 624px; container uses `overflow: clip`; scales with its column width
- Container (verified in Figma): `max-width: 1280px`, centered, full width below that.
  - Mobile: 16px side padding.
  - Tablet, laptop, desktop: **32px** left/right padding, **32px** gap between content and illustration columns.
  - The "39px" on desktop is NOT padding: it is the leftover margin at the 1358px frame ((1358 − 1280) / 2). It comes from `mx-auto`.
  - Check: laptop 32 + 492 + 32 + 492 + 32 = 1080; desktop 32 + 592 + 32 + 592 + 32 = 1280.
- Main section padding: top 32px, bottom 56px (tablet, laptop, desktop).

## Callout pill

- Background #000000, radius 14px, padding 4px 8px 4px 4px
- Inner badge: background indigo-500, radius 10px, padding 2px 12px, uppercase 12px/500/+2.5 tracking
- Badge → text gap 16px
- Text link 14px/400 followed by a 20 × 20 chevron-right icon

## Form

| | Desktop | Mobile |
|---|---|---|
| Layout | Horizontal | Stacked |
| Container width | 576px | 344px (full) |
| Input width | 425px (flex-grows) | 344px (full) |
| Button width | 139px | 344px (full) |
| Height (both) | 48px | 48px |
| Gap | 12px | 12px |

- Text input: white background, radius 6px, padding 12px 16px, height 48px, no visible border; placeholder gray-500 16px/400
- Submit button: indigo-500, radius 6px, padding 12px 16px, height 48px, text white 16px/500, shadow `0 1px 2px rgba(0,0,0,.05), 0 1px 3px rgba(0,0,0,.10)`
- Help text: gray-300 14px/400/20px; "terms of service" is white 14px/500; 16px gap above; max-width 576px desktop / 344px mobile

## Mobile menu drawer

- White background, radius 8px, padding 8px, md shadow
- Header 56px tall, 20px padding (logo + close button)
- Nav links 40px tall, padding 8px 12px, text gray-700 16px/400
- CTA "Start free trial" (verified): indigo-600, 48px tall, full width (320px), radius 6px, padding 12px 16px, `shadow-sm` (0 1px 2px rgba(0,0,0,.05)), text white 16px/500
- Footer row: "Existing customer? Login"
- Slides from the top: -408px → 0

## Interactive states (verified in Figma Symbols page)

| Component | Default | Hover | Focus |
|---|---|---|---|
| Submit button (indigo-500) | bg indigo-500, shadow base | bg **indigo-600** (#4F46E5) | bg indigo-500 + **2px ring indigo-300 (#A5B4FC) with 2px offset gray-900** (`ring-2 ring-indigo-300 ring-offset-2 ring-offset-gray-900`) |
| Nav button (gray-600) | bg gray-600 | bg **gray-700** (#374151) | same as default in Figma → use the shared focus ring |
| Mobile CTA (indigo-600) | bg indigo-600, shadow-sm | bg **indigo-700** (#4338CA), shadow-sm | same as default in Figma → use the shared focus ring |
| Nav link (white text) | text white | text **gray-300** (#D1D5DB) | use the shared focus ring |
| Text input | white bg, no border | white bg (no change) | white bg + the same 2px indigo-300 ring with 2px offset |

- Shared focus style for every interactive element: `focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900` (on the white mobile drawer, offset color is white).
- Disabled / loading (not in Figma): `disabled:cursor-not-allowed disabled:opacity-75`, keep the default background, no hover change while disabled.
- Hover/focus for mobile menu link, close button and menu trigger exist in Figma Symbols but were not transcribed: ask before inventing values.

## Interaction annotations (Figma)

- **1.1 Menu:** the hamburger opens the menu, which slides down into view while opacity goes 0 → 1, ease-in-out, 500ms.
- **1.2 Close:** the close button slides the menu up and out while opacity goes 1 → 0, ease-in-out, 300ms.
- **1.3 Overlay:** tapping anywhere on the overlay outside the menu closes it with the same animation as the close button. Overlay is full-bleed, fill gray-500 (#6B7280, verified). Figma view mode does not expose the layer opacity; use 75% (`bg-gray-500/75`, matches the visual and the Tailwind UI pattern this design is based on).
- **4.1 Maximum width:** on larger screens the content stays in a 1280px max-width container, with empty space on both sides.

## Copy

- Nav: Product · Features · Marketplace · Company · Log in · Start free trial
- Callout: badge "We're hiring" · link "Visit our careers page"
- Heading: "A better way to" / "ship web apps" (second line in indigo-400)
- Body: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui Lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat."
- Input placeholder: "Enter your email" · Button: "Start free trial"
- Helper: "Start your free 14-day trial, no credit card necessary. By providing your email, you agree to our **terms of service**."
- Mobile menu: the 4 nav links · "Start free trial" · "Existing customer? Login"

## Assets (`src/assets`)

| File | Size | Notes |
|---|---|---|
| icons/logo-mark.svg | 44 × 40 | Indigo-500 fill; scale to 35 × 32 on mobile |
| icons/chevron-right.svg | 20 × 20 | Callout link |
| icons/menu.svg | 24 × 24 | Hardcoded stroke #9CA3AF; replace with `currentColor` |
| icons/close.svg | 24 × 24 | Hardcoded stroke #9CA3AF; replace with `currentColor` |
| images/hero-illustration.svg | 626 × 624 | Pure vector, ~10KB; shared across all breakpoints |

## Bonus (only after every design requirement is done)

The "Start free trial" submit sends a GraphQL mutation to the dummy endpoint `https://graphqlzero.almansi.me/api`:

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) { id name email }
}
```

`CreateUserInput` requires `name`, `username` and `email`; derive `name` and `username` from the email's local part.
