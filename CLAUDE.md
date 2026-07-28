# CLAUDE.md

## Project Purpose
Community n8n node package (`@apify/n8n-nodes-apify`) that integrates the [Apify](https://apify.com) platform with [n8n](https://n8n.io/) workflows. Provides nodes to run Apify Actors and tasks, fetch dataset / key-value-store data, and trigger workflows when Actor or task runs finish.

## Repository Structure
- `nodes/Apify/` — main node source.
  - `Apify.node.ts` / `Apify.node.json` — main Apify action node.
  - `ApifyTrigger.node.ts` / `ApifyTrigger.node.json` — trigger node (Actor / task run finished).
  - `Apify.properties.ts`, `Apify.methods.ts`, `properties.json` — generated/maintained UI properties and methods.
  - `resources/` — per-resource handlers: `actors/`, `actor-tasks/`, `actor-runs/`, `datasets/`, `key-value-stores/`, plus `router.ts`, `executeActor.ts`, `genericFunctions.ts`, `hooks.ts`, and resource locators.
    - Each resource has `index.ts` (operation list + `operation` select), `router.ts` (operation → execute dispatch), `hooks.ts`, and one directory per operation (e.g. `actor-runs/abort-run/`) containing `index.ts`, `properties.ts`, `execute.ts`, `hooks.ts`.
  - `helpers/` — shared `consts.ts`, `hooks.ts`, `methods.ts`.
  - `__tests__/` — Jest specs (excluded from `tsconfig`), `utils/` helpers + `fixtures.ts`, and `workflows/<resource>/*.workflow.json` exported n8n workflows used as test inputs.
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
- Two credential types: `apifyApi` (API key, all installs) and `apifyOAuth2Api` (n8n cloud only).
- Tests live in `nodes/Apify/__tests__/` matching `**/?(*.)+(spec).ts`; excluded from the TypeScript build via `tsconfig.json`.
- Resource / operation names are human-readable strings with spaces (e.g. resource `Actor runs`, operation `Abort run`) and are used verbatim as `displayOptions.show` values, router `switch` cases, and workflow-JSON parameters — keep them identical across `index.ts`, `properties.ts`, `router.ts`, and test workflows.
- Adding an operation by hand: create `resources/<resource>/<operation>/` with `properties.ts` (gated by `displayOptions.show` on resource + operation), `execute.ts`, `hooks.ts`, `index.ts` (exports `option`, `properties`, `name`), then register it in the resource's `index.ts` (`operations` array + spread into `rawProperties`) and `router.ts`. Cover it with a `__tests__/workflows/<resource>/<op>.workflow.json` fixture, a `nock` scope, and a fixture factory in `__tests__/utils/fixtures.ts`.

## Key Notes for AI Assistants
- Node engine mismatch is intentional/known: `package.json` engines = `>=22.0.0`, README says 22.x, but CI (`ci.yml`, `publish.yml`) runs Node `24.x`. Don't "fix" one without checking the others.
- `package.json#main` is `index.js` (empty stub); n8n loads compiled artifacts from `dist/` listed under the `n8n` field — always run `npm run build` before linking/testing in n8n.
- Many node properties are generated from an OpenAPI spec via `nodes.config.js` + `npm run merge:api`. When changing operation surface, update the spec / `tags` list in `nodes.config.js` rather than hand-editing generated property files.
- Not every operation is generated: several OpenAPI tags in `nodes.config.js` are intentionally commented out (`Actor runs/Abort run`, `Delete run`, `Metamorph run`, `Reboot run`, `Resurrect run`, `Update status message`, …). `Actor runs → Abort run` is implemented by hand in `resources/actor-runs/abort-run/` while its tag stays commented out — don't uncomment the tag to "enable" it, or the generated properties will collide with the hand-written ones.
- `abort-run/execute.ts` `POST`s `/v2/actor-runs/{runId}/abort` and only sends `gracefully=true` as a query param when the boolean is set (omitting the param entirely otherwise). It reads `abortRunId` (not `runId`) as its parameter name.
- The `fix: prevent duplicate actor runs with multiple input items` change (commit `4a3836e`) is recent — be cautious about regressing input-iteration behavior in `resources/executeActor.ts` and related actor/task run handlers.
- HTTP requests in `resources/genericFunctions.ts#apiRequest` carry a default `timeout` (`DEFAULT_REQUEST_TIMEOUT_MS`, 60s; overridable per request via `requestOptions.timeout`); dataset item downloads pass the longer `DATASET_REQUEST_TIMEOUT_MS` (10m). Network errors (no HTTP status, e.g. socket timeouts) are retried **only for idempotent `GET`** requests (`retryNetworkErrors: method === 'GET'`) — never widen this to POST, which could create duplicate Actor runs. All timeout constants live in `helpers/consts.ts`.
- `pollRunStatus` is bounded: it caps polling at the run's own `timeoutSecs` plus `WAIT_FOR_FINISH_BUFFER_MS` (5m grace), falling back to `WAIT_FOR_FINISH_MAX_DURATION_MS` (24h) when the run has no timeout, and throws once exceeded. Don't reintroduce unbounded `while (true)` polling.
- Do not bump version manually; the release workflow owns `package.json` / `package-lock.json` version updates.
- Don't commit `dist/`; it is built in CI/release and listed in `package.json#files` only for publish.
- `Apify.node.ts#execute` carries an intentional `// eslint-disable ... require-continue-on-fail` — `continueOnFail` is handled inside `executeAndLinkItems` (`resources/genericFunctions.ts`), not in `execute`. Don't remove the disable.
