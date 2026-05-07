# CLAUDE.md

## Project Purpose
n8n community node package (`@apify/n8n-nodes-apify`) that integrates the [Apify](https://apify.com) platform with [n8n](https://n8n.io) workflows. Exposes Apify Actors, tasks, runs, datasets, and key-value stores as workflow operations, plus a webhook-based trigger node for run lifecycle events.

## Repository Structure
- `nodes/Apify/Apify.node.ts` — main `Apify` action node (resource router, AI-tool-usable).
- `nodes/Apify/ApifyTrigger.node.ts` — webhook trigger node that subscribes to Apify run-finished events.
- `nodes/Apify/Apify.properties.ts` — top-level node properties (auth + resource selection).
- `nodes/Apify/properties.json` — generated property definitions (large, derived from Apify OpenAPI).
- `nodes/Apify/resources/` — per-resource handlers (`actors/`, `actor-tasks/`, `actor-runs/`, `datasets/`, `key-value-stores/`), shared `router.ts`, resource locators, `genericFunctions.ts` (HTTP, retry, polling, item linking), and `executeActor.ts`.
- `nodes/Apify/helpers/` — `consts.ts`, `hooks.ts`, `methods.ts` aggregator, shared utilities.
- `nodes/Apify/__tests__/` — Jest specs and workflow fixtures (excluded from build).
- `credentials/` — `ApifyApi.credentials.ts` (API key) and `ApifyOAuth2Api.credentials.ts` (OAuth2, n8n Cloud only).
- `nodes.config.js` — config consumed by `@n8n/node-cli` to merge the Apify OpenAPI into property definitions.
- `docs/`, `icons/`, `README.md`, `gulpfile.js`, `eslint.config.mjs`, `tsconfig.json`.
- `.github/workflows/` — `ci.yml`, `publish.yml` (release-triggered npm publish via OIDC), `claude-md-maintenance.yml`.

## Technology Stack
- TypeScript 5.5 targeting ES2019, CommonJS output to `dist/`.
- Node.js >= 22, npm 10.8.2.
- Peer dependency: `n8n-workflow@1.82.0`.
- Build/dev/lint via `@n8n/node-cli`.
- Tests: Jest + ts-jest, with `nock` for HTTP mocking.

## Build, Test & Run
```bash
npm install
npm run build         # n8n-node build → dist/
npm run build:watch   # tsc --watch
npm run dev           # n8n-node dev (starts n8n with the node linked)
npm run lint          # n8n-node lint
npm run lint:fix
npm run format        # prettier on nodes/ and credentials/
npm test              # WEBHOOK_URL=https://localhost:5678 jest
npm run merge:api     # regenerate properties via openapi-merge-cli
```
For the trigger node to receive webhooks during local dev, export a publicly reachable `WEBHOOK_URL` before `npm run dev`.

## Conventions
- Conventional Commits (`feat:`, `fix:`, `chore:`, `ci:`, `docs:`); PR titles follow the same format.
- Releases are driven by publishing a GitHub Release with tag `vX.Y.Z`; the `publish.yml` workflow bumps `package.json`, commits `chore(release): set version to X.Y.Z [skip ci]`, and publishes to npm via OIDC trusted publishing. Do not manually bump the version in PRs.
- Prettier + ESLint (`eslint.config.mjs`) — run `npm run format` and `npm run lint:fix` before committing.
- Resources live under `nodes/Apify/resources/<resource>/` with `index.ts`, `router.ts`, and operation modules; new resources must be wired into `resources/index.ts` and `resources/router.ts`.
- `genericFunctions.ts::apiRequest` is the single HTTP entry point — it injects `x-apify-integration-platform: n8n`, adds `x-apify-integration-ai-tool` when invoked as an AI tool, retries 429/5xx with exponential backoff, and resolves credentials from the `authentication` parameter.

## Key Notes for AI Assistants
- The action node iterates input items via `executeAndLinkItems` (`nodes/Apify/resources/genericFunctions.ts`). The callback receives the `itemIndex` and must return data for **that single item only** — it is invoked once per input item, and `pairedItem` linking is added by the wrapper. Do not loop over `getInputData()` inside the callback or you will trigger duplicate Actor runs (the bug fixed in 4a3836e).
- When adding new operations, read `getNodeParameter(name, itemIndex)` with the index passed into the router; never hard-code index `0` for per-item parameters.
- `properties.json` is generated — do not hand-edit; regenerate via `npm run merge:api` against the Apify OpenAPI.
- Tests are excluded from `tsc` (`tsconfig.json` excludes `nodes/Apify/__tests__`); they run through ts-jest only.
- OAuth2 credentials are only usable on n8n Cloud; default and most-tested path is API key (`apifyApi`).
- The trigger node creates Apify webhooks via `POST /v2/webhooks` with an idempotency key derived from `resource:id:eventTypes`; deletion uses the stored `webhookId` in workflow static data.
- Both nodes set `usableAsTool: true`; the AI-tool variant has node type suffix `apifyTool` (see `isUsedAsAiTool`), which triggers the extra request header.
