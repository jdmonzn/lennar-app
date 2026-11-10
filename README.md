# Lennar Hero Section

A responsive hero section built in React and TypeScript from a Figma design: a navbar with a mobile menu drawer and overlay, a callout pill, a display heading, an email signup form, and an illustration. It is laid out for four breakpoints (376, 834, 1080 and 1358 px). The base UI components (buttons, text, inputs, icons) are built in-house; no UI component libraries are used. Submitting the signup form sends a `createUser` mutation to the public [GraphQLZero](https://graphqlzero.almansi.me) API using plain `fetch`.

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

## Environment

| Variable                | Default                              | Purpose                              |
| ----------------------- | ------------------------------------ | ------------------------------------ |
| `VITE_GRAPHQL_ENDPOINT` | `https://graphqlzero.almansi.me/api` | GraphQL endpoint for signup requests |

The variable is optional. To override it, copy `.env.example` to `.env` (`.env` is git-ignored). The production Content Security Policy in `vite.config.ts` only allows connections to `https://graphqlzero.almansi.me`, so a different host must also be added to `connect-src`.

## GraphQL signup

The signup form depends only on the `SignupService` interface. `App.tsx` chooses the implementation and provides it through React context:

- `GraphQLSignupService` is used by the app. It sends the mutation below, with `name` and `username` taken from the part of the email before the `@`.
- `MockSignupService` is an offline fake with a simulated delay. Pass it to the provider in `App.tsx` instead to run without network access.

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
  }
}
```

`graphqlRequest` is the transport. It always sends `{ query, variables }` (user input is never put into the query string) and returns a `Result` instead of throwing. Each failure has its own kind, and the form shows fixed copy for each one, never the raw server message:

| Case                                                 | Request error        | Shown to the user as |
| ---------------------------------------------------- | -------------------- | -------------------- |
| Request could not be sent or the user aborted it     | `network`, `aborted` | `network`            |
| No response within 10 seconds                        | `timeout`            | `timeout`            |
| Non-2xx HTTP status, or a GraphQL `errors` array     | `http`, `graphql`    | `server`             |
| Body is not JSON or does not have the expected shape | `invalidResponse`    | `invalidResponse`    |

The in-flight request is aborted if the form unmounts. Client-side email validation is for UX only; a real backend must validate the email again.

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
│   ├── graphql/     graphqlRequest (fetch transport) and GraphQLSignupService (createUser mutation)
│   └── mock/        MockSignupService (offline fake, simulated ~800 ms signup)
├── shared/
│   ├── hooks/       useDisclosure, useEscapeKey, useFocusTrap, useMediaQuery, useScrollLock
│   └── lib/         Result type, assertNever, isRecord type guard, cn class-name helper
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
