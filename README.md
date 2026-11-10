# Lennar Hero Section

A responsive hero section built in React and TypeScript from a Figma design: a navbar with a mobile menu drawer and overlay, a callout pill, a display heading, an email signup form, and an illustration. It is laid out for four breakpoints (376, 834, 1080 and 1358 px). The base UI components (buttons, text, inputs, icons) are built in-house; no UI component libraries are used.

## Tech stack

| Tool                                              | Version (package.json)     |
| ------------------------------------------------- | -------------------------- |
| React + React DOM                                 | ^19.3.1                    |
| TypeScript (strict)                               | ~6.0.3                     |
| Vite                                              | ^8.3.6                     |
| Tailwind CSS (via `@tailwindcss/vite`)            | ^4.3.5                     |
| Inter (self-hosted, `@fontsource-variable/inter`) | ^5.3.0                     |
| Vitest (jsdom)                                    | ^5.1.0                     |
| Testing Library: React / user-event / jest-dom    | ^16.3.3 / ^14.6.8 / ^7.0.1 |
| ESLint + typescript-eslint                        | ^9.39.5 + ^8.72.1          |
| Prettier                                          | ^3.9.10                    |

## Requirements

- Node.js 22.12+ (22.x), 24.x, or 26+. There is no `.nvmrc` or `engines` field; this range comes from the `engines` of the installed Vite, Vitest and jest-dom packages.
- npm (the repo ships a `package-lock.json`).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks, then builds to dist/
npm run preview   # serves the production build from dist/
```

## Scripts

| Script        | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| `dev`         | Start the Vite dev server with hot reload.                        |
| `build`       | Type-check (`tsc -b`), then create a production build in `dist/`. |
| `preview`     | Serve the production build locally.                               |
| `typecheck`   | Run the TypeScript compiler without emitting files.               |
| `lint`        | Run ESLint on the whole project.                                  |
| `format`      | Format all files with Prettier.                                   |
| `test`        | Run every test once (`*.test.*` and `*.spec.*`).                  |
| `test:agent`  | Run tests, excluding the `*.spec.*` acceptance specs.             |
| `check`       | `typecheck`, `lint`, `test` and `build` in sequence.              |
| `check:agent` | `typecheck`, `lint`, `test:agent` and `build` in sequence.        |

## Project structure

```
src/
├── app/             Composition root: main.tsx mounts the app, App.tsx wires the page and injects the signup service
├── assets/          Source SVGs
│   ├── icons/       Logo mark, menu, close and chevron icons
│   └── images/      Hero illustration
├── content/         heroContent.ts: all page copy and links as typed constants
├── domain/
│   └── signup/      EmailAddress value object, SignupService interface, signup types (no React)
├── features/
│   ├── hero/        Hero section, callout pill, illustration
│   ├── navigation/  Navbar, desktop nav, mobile menu drawer and overlay
│   └── signup/      Signup form, useSignupForm hook, service context
├── infrastructure/
│   ├── graphql/     GraphQL request helper and GraphQL signup service
│   └── mock/        MockSignupService (simulated ~800 ms signup)
├── shared/
│   ├── hooks/       useDisclosure, useEscapeKey, useFocusTrap, useMediaQuery, useScrollLock
│   └── lib/         Result type, assertNever, cn class-name helper
├── styles/          index.css: Tailwind import, Inter font-face and @theme design tokens
├── test/            setup.ts: Vitest and jest-dom setup
├── ui/              In-house primitives: Button, ButtonLink, IconButton, Text, TextInput, Container, VisuallyHidden
│   └── icons/       SVG icon components
└── vite-env.d.ts    Typed Vite environment variables
```

Tests sit next to the code they cover: `*.test.ts(x)` for unit and component tests, `*.spec.ts(x)` for acceptance specs.

Outside `src/`:

- `docs/`: `design-spec.md` (visual values from Figma) and `BUILD_ORDER.md` (build phases).
- `.cursor/rules/`: project conventions for TypeScript, architecture, components, styling, security, performance, testing and git.
