# CLAUDE.md

## Project Purpose
Community n8n node package (`@apify/n8n-nodes-apify`) that integrates the [Apify](https://apify.com) platform with [n8n](https://n8n.io/) workflows. Provides nodes to run Apify Actors and tasks, fetch dataset / key-value-store data, and trigger workflows when Actor or task runs finish.

## Repository Structure
- `nodes/Apify/` — main node source.
  - `Apify.node.ts` / `Apify.node.json` — main Apify action node. The codex JSON declares `subcategories` (`AI: [Tools]`, `Tools: [Other Tools]`) so the node is surfaced as an AI Agent tool.
  - `ApifyTrigger.node.ts` / `ApifyTrigger.node.json` — trigger node (Actor / task run finished); codex JSON also declares `subcategories` (`AI: [Tools]`).
  - `Apify.properties.ts`, `Apify.methods.ts`, `properties.json` — generated/maintained UI properties and methods.
  - `resources/` — per-resource handlers: `actors/`, `actor-tasks/`, `actor-runs/`, `datasets/`, `key-value-stores/`, plus `router.ts`, `executeActor.ts`, `genericFunctions.ts`, `hooks.ts`, and resource locators.
  - `helpers/` — shared `consts.ts`, `hooks.ts`, `methods.ts`.
  - `__tests__/` — Jest specs (excluded from `tsconfig`).
  - `apify.svg` — node icon.
- `credentials/` — `ApifyApi.credentials.ts` (API key) and `ApifyOAuth2Api.credentials.ts` (OAuth2, n8n cloud only).
- `icons/`, `docs/` — node icon assets and README screenshots.
- `nodes.config.js` — `@n8n/node-cli` config (package name, credentials, OpenAPI tags/excludes, name overrides).
- `gulpfile.js`, `tsconfig.json`, `eslint.config.mjs`, `tslint.json`, `.eslintrc.prepublish.js`, `.prettierrc.js`, `jest.config.js` — build / lint / format / test config.
- `.github/workflows/ci.yml` — lint, type-check, build, test on push / PR to `master`.
- `.github/workflows/publish.yml` — release-triggered build, version bump, npm publish.

## Technology Stack
- **Language:** TypeScript 5.5 (CommonJS, target ES2019, strict mode).
- **Runtime:** Node.js — `package.json` requires `>=22.0.0`; CI runs on `24.x`.
- **Package manager:** npm `10.8.2`.
- **n8n:** peer dep `n8n-workflow` is unpinned (`*`); build/dev tooling via `@n8n/node-cli`.
- **Test:** Jest + ts-jest, with `nock` for HTTP mocking.
- **Lint/format:** ESLint 9 (via `n8n-node lint`), Prettier 3.

## Build, Test & Run
- `npm install` — install deps.
- `npm run build` — build via `n8n-node build` (output in `dist/`).
- `npm run build:watch` — `tsc --watch` only.
- `npm run dev` — start n8n dev server with this node linked (`n8n-node dev`).
- `npm run lint` / `npm run lint:fix` — `n8n-node lint`.
- `npx tsc --noEmit` — type check (mirrors CI).
- `npm test` — Jest (sets `WEBHOOK_URL=https://localhost:5678`).
- `npm run format` — Prettier on `nodes` and `credentials`.
- `npm run merge:api` — merge OpenAPI specs via `openapi-merge-cli`.

For trigger development on self-hosted n8n, export a public `WEBHOOK_URL` before `npm run dev` (see README).

## Conventions
- Default branch: `master`. PRs target `master`; CI must pass (lint, type-check, build, test).
- Conventional Commits (`feat:`, `fix:`, `chore:`, `ci:`, `chore(release):`); `[skip ci]` suffix for release version-bump commits.
- Releases: publish a GitHub Release with tag `vX.Y.Z`; the `publish.yml` workflow extracts the version, runs `npm version`, commits `chore(release): set version to X.Y.Z [skip ci]` to the target branch, and publishes `@apify/n8n-nodes-apify@X.Y.Z` to npm with `--provenance --access public` (skips if version already exists).
- Two credential types: `apifyApi` (API key, all installs) and `apifyOAuth2Api` (n8n cloud only). `apifyApi` exposes an n8n credential `test` that `GET`s `/v2/users/me` against `APIFY_API_URL` — so `credentials/` imports from `nodes/Apify/helpers/consts`; keep base URLs in `consts.ts` rather than hard-coding them.
- Tests live in `nodes/Apify/__tests__/` matching `**/?(*.)+(spec).ts`; excluded from the TypeScript build via `tsconfig.json`. Specs drive nodes through the `executeWorkflow` harness (`__tests__/utils/executeWorkflow.ts`) with workflow fixtures in `__tests__/workflows/`; to test a non-default parameter, spread the fixture and override that node's `parameters`.

## Key Notes for AI Assistants
- Node engine mismatch is intentional/known: `package.json` engines = `>=22.0.0`, README says 22.x, but CI (`ci.yml`, `publish.yml`) runs Node `24.x`. Don't "fix" one without checking the others.
- `package.json#main` is `index.js` (empty stub); n8n loads compiled artifacts from `dist/` listed under the `n8n` field — always run `npm run build` before linking/testing in n8n.
- Many node properties are generated from an OpenAPI spec via `nodes.config.js` + `npm run merge:api`. When changing operation surface, update the spec / `tags` list in `nodes.config.js` rather than hand-editing generated property files. Exception: hand-written operations such as `resources/actors/scrape-single-url/` keep their own `properties.ts` — edit those directly.
- `Scrape single URL` returns lean, AI-agent-friendly output: `outputFormat` (`markdown` default / `html` / `text`) selects the single content field returned, and `includeMetadata` (default `false`) adds page metadata. The scraper Actor returns all content fields regardless of the `saveHtml` / `saveMarkdown` input flags, so `execute.ts` strips `text` / `html` / `markdown` from the metadata and re-adds only the selected format. Keep that stripping when adding fields, or the "lean output" contract breaks.
- The `fix: prevent duplicate actor runs with multiple input items` change (commit `4a3836e`) is recent — be cautious about regressing input-iteration behavior in `resources/executeActor.ts` and related actor/task run handlers.
- HTTP requests in `resources/genericFunctions.ts#apiRequest` carry a default `timeout` (`DEFAULT_REQUEST_TIMEOUT_MS`, 60s; overridable per request via `requestOptions.timeout`); dataset item downloads pass the longer `DATASET_REQUEST_TIMEOUT_MS` (10m). Network errors (no HTTP status, e.g. socket timeouts) are retried **only for idempotent `GET`** requests (`retryNetworkErrors: method === 'GET'`) — never widen this to POST, which could create duplicate Actor runs. All timeout constants live in `helpers/consts.ts`.
- `pollRunStatus` is bounded: it caps polling at the run's own `timeoutSecs` plus `WAIT_FOR_FINISH_BUFFER_MS` (5m grace), falling back to `WAIT_FOR_FINISH_MAX_DURATION_MS` (24h) when the run has no timeout, and throws once exceeded. Don't reintroduce unbounded `while (true)` polling.
- The test harness's `getNodeParameter` mock mirrors n8n by falling back to the caller-supplied default (`node.parameters[name] ?? fallbackValue`) — don't "simplify" it back to a bare lookup, or handlers relying on defaults will see `undefined` in tests only.
- Do not bump version manually; the release workflow owns `package.json` / `package-lock.json` version updates.
- Don't commit `dist/`; it is built in CI/release and listed in `package.json#files` only for publish.
- `Apify.node.ts#execute` carries an intentional `// eslint-disable ... require-continue-on-fail` — `continueOnFail` is handled inside `executeAndLinkItems` (`resources/genericFunctions.ts`), not in `execute`. Don't remove the disable.
