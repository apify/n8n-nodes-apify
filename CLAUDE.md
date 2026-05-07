# CLAUDE.md

## Project Purpose
`@apify/n8n-nodes-apify` is an n8n community node package that integrates the [Apify](https://apify.com) platform with n8n workflows. It exposes Apify Actors, Actor tasks, runs, datasets, key-value stores, and webhook-driven triggers as nodes that can be used inside n8n's visual automation editor.

## Repository Structure
- `nodes/Apify/` — main node implementation
  - `Apify.node.ts`, `ApifyTrigger.node.ts` — node entry points (regular + webhook trigger)
  - `Apify.properties.ts`, `Apify.methods.ts`, `properties.json` — UI properties and listSearch/loadOptions methods
  - `resources/` — per-resource handlers (`actors/`, `actor-tasks/`, `actor-runs/`, `datasets/`, `key-value-stores/`), plus `router.ts`, `genericFunctions.ts`, `executeActor.ts`, and resource locators
  - `helpers/` — shared utilities (`consts.ts`, `hooks.ts`, `methods.ts`)
  - `__tests__/` — Jest specs, including workflow fixtures under `__tests__/workflows/`
- `credentials/` — `ApifyApi.credentials.ts` (API key) and `ApifyOAuth2Api.credentials.ts` (OAuth2, n8n cloud only)
- `docs/` — README screenshots
- `.github/workflows/` — `ci.yml`, `publish.yml` (release-driven npm publish), `claude-md-maintenance.yml`
- `gulpfile.js`, `eslint.config.mjs`, `tsconfig.json`, `jest.config.js`, `nodes.config.js` — build/test/lint config
- `index.js` — package entry; built artifacts are emitted to `dist/` (the only thing published to npm)

## Technology Stack
- **Language**: TypeScript 5.5.3, compiled via `@n8n/node-cli`
- **Runtime**: Node.js >= 22, npm >= 10.8.2 (publish workflow ensures `npm@^11.5.1`)
- **n8n**: peer dep `n8n-workflow@1.82.0`; compatible with n8n 1.57.0+
- **Tests**: Jest + ts-jest, `nock` for HTTP mocking
- **Tooling**: ESLint 9, Prettier, Gulp, `openapi-merge-cli` (via `npm run merge:api`)

## Build, Test & Run
```bash
npm install           # install deps
npm run build         # build via @n8n/node-cli (emits to dist/)
npm run build:watch   # tsc --watch
npm run dev           # n8n-node dev — runs n8n with this node linked
npm run lint          # n8n-node lint
npm run lint:fix
npm run format        # prettier on nodes/ and credentials/
npm test              # WEBHOOK_URL=https://localhost:5678 jest
npm run merge:api     # regenerate merged OpenAPI spec
```
For trigger development, set `WEBHOOK_URL` to a publicly reachable address before `npm run dev`.

## Conventions
- **Branch / release**: default branch is `master`. Releases are published by creating a GitHub Release with tag `vX.Y.Z`; `publish.yml` then bumps `package.json`/`package-lock.json`, commits `chore(release): set version to X.Y.Z [skip ci]`, and runs `npm publish`.
- **Commits**: conventional commits (`feat:`, `fix:`, `chore:`, `ci:`, `chore(release):`). Generated release notes rely on this.
- **Code style**: Prettier + ESLint (n8n-node preset). Run `npm run format` and `npm run lint:fix` before committing.
- **n8n manifest**: `package.json` `n8n` block lists the `dist/`-relative paths of credentials and nodes — keep it in sync when adding either.

## Key Notes for AI Assistants
- Only `dist/` is published (`files` in `package.json`). Source changes must build cleanly or the node will not load in n8n.
- Resource handlers live under `nodes/Apify/resources/<resource>/` and are wired through `resources/router.ts` — when adding an operation, update both the resource folder and the router, and add UI properties in `Apify.properties.ts` / `properties.json`.
- The trigger node (`ApifyTrigger.node.ts`) registers Apify webhooks; trigger tests in `__tests__/workflows/` depend on `WEBHOOK_URL` being set.
- Two credential types coexist: `apifyApi` (API key, works everywhere) and `apifyOAuth2Api` (OAuth2, n8n cloud only). Prefer reading credentials through the existing helpers in `resources/genericFunctions.ts` rather than re-implementing auth.
- Do not hand-edit `package.json` version — the release workflow owns it.
- The publish workflow installs npm globally with `--force` to bypass conflicts with the runner's preinstalled npm; do not remove this flag without verifying release CI still passes.
