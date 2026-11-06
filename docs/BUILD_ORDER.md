# Build Order

Ownership: **Cursor** = scaffold, styling, presentational components, stubs and specs, tests. **JD** = domain, behavior hooks, form logic, GraphQL.
Give Cursor one phase per prompt. Review and commit after each phase.

## Phase 1 — Scaffold (Cursor)

> The folder already has .cursor/, docs/, src/assets/ and .gitignore. Do NOT run `npm create vite` (it can wipe a non-empty folder). Create the files manually and keep the existing .gitignore. Scaffold the project per the rules: Vite + React 19 + TS, strict tsconfig, ESLint flat config with every rule listed in 10-typescript.mdc, Prettier, Vitest + Testing Library, Tailwind v4 with the exact @theme tokens, self-hosted Inter, the production-only CSP plugin, index.html meta, all package.json scripts, `.env.example`, and `src/shared/lib/{result,assertNever,cn}.ts`. Run `npm run check:agent`.

Commit: `chore: scaffold vite react ts project with strict tooling`

## Phase 2 — Contracts, stubs and specs (Cursor)

> Create the agent-written contract types and every human-owned stub plus its `.spec` file, exactly as listed in 80-human-owned.mdc. Implement MockSignupService. Do not implement any human-owned file.

Commit: `test: add domain contracts, human-owned stubs and acceptance specs`

## Phase 3 — UI primitives and icons (Cursor)

> Build `src/ui`: Button, Text, TextInput, Container, VisuallyHidden, and the four icon components converted from `src/assets/icons` (currentColor). Optimize hero-illustration.svg with `npx svgo`. Add `.test.tsx` files.

Commit: `feat(ui): add base UI primitives and icons`

## Phase 4 — Static page (Cursor)

> Build `content/heroContent.ts`, then the hero, navbar, mobile menu (presentational, driven by props) and signup form markup, pixel-matched at 376/834/1080/1358. Wire the human-owned hooks into the components exactly as the contracts define them.

Commit: `feat: implement responsive hero layout`
The page throws until Phase 5 is done; that's expected. Tip: start Phase 5 while Cursor runs Phases 3–4. The specs from Phase 2 are all you need, and the page renders as soon as the hooks land.

## Phase 5 — Behavior (JD)

Implement each one until its `.spec` passes (`npx vitest <file>`), committing each separately:

1. `useDisclosure` — warm-up
2. `useEscapeKey`
3. `useScrollLock`
4. `useMediaQuery` (`useSyncExternalStore`)
5. `useFocusTrap` — the hardest one
6. `EmailAddress` value object
7. `useSignupForm` (with MockSignupService)

Ask Cursor for a review (in review mode it gives hints, not solutions). Then run `npm run check`, which must be fully green.

## Phase 6 — Verify the design (JD + Cursor)

- Compare against Figma at 376 / 834 / 1080 / 1358.
- Lighthouse on `npm run build && npm run preview` (mobile): 100 ×4.
- Keyboard-only pass: Tab order, Esc, focus return, visible focus.

## Phase 7 — GraphQL bonus (JD)

Only once Phase 6 is clean:

1. `graphqlRequest` — POST `{ query, variables }`, AbortController timeout, `unknown` → type guard, error mapping
2. `GraphQLSignupService` — the `createUser` mutation
3. Swap the adapter in the `app/` composition root

## Phase 8 — Ship (Cursor drafts, JD edits)

- README per 90-git-and-docs.mdc (JD writes "How AI was used" and the tradeoffs in his own words)
- Optional Netlify deploy with `public/_headers`
- Push to GitHub, reply-all with the repo link
