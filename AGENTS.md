# AGENTS.md

Guidance for AI agents and contributors working in this repository. This is the single
instruction doc — `CLAUDE.md` is only a `@AGENTS.md` pointer, so put instructions here and
leave the pointer alone. `.github/workflows/agents-md-maintenance.yml` keeps this file in
sync on every PR.

## Project

`@apify/n8n-nodes-apify` — n8n community node package integrating the [Apify](https://apify.com)
platform. Ships two nodes (`Apify` action node, `ApifyTrigger` webhook node) and two credential
types: `apifyApi` (API key, everywhere) and `apifyOAuth2Api` (PKCE OAuth2, **n8n cloud only**).

## Commands

```bash
npm install            # engine-strict=true: hard-fails on Node <22 or npm <11.10.0
npm run build          # -> dist/ (icons copied by gulpfile.js)
npm run dev            # n8n dev server with this node linked
npm run lint           # ESLint 9 + n8n-nodes-base rules; lint:fix to autofix
npx tsc --noEmit       # type check — same as CI
npm test               # jest; sets WEBHOOK_URL=https://localhost:5678
npm run format         # prettier on nodes/ and credentials/
```

Single test: `npx jest -t '<test name>'` or `npx jest <path>`.

CI runs lint → `tsc --noEmit` → build → test on Node 24.x for PRs to `master`. The version
spread is known: `package.json` engines say Node `>=22`, the README says 22.x, CI runs 24.x —
check all three before "fixing" any one of them. `.npmrc` sets `min-release-age=3`, so
installing a package published in the last 3 days fails; Renovate opens weekly `chore:`
dependency PRs with a matching cooldown.

For trigger work on self-hosted n8n, export a public `WEBHOOK_URL` before `npm run dev` — n8n
otherwise mints `localhost` URLs Apify can't reach.

## Architecture

### Request layer — `nodes/Apify/resources/genericFunctions.ts`

Everything funnels through `apiRequest`, which reads the node's `authentication` parameter,
resolves credentials, stamps the `x-apify-integration-*` headers, forces `json: true`, and
applies `DEFAULT_REQUEST_TIMEOUT_MS` (60s, overridable per call). Retry policy is load-bearing:
429/5xx retry with exponential backoff, and status-less network errors (socket timeout, reset,
DNS) retry **only when `method === 'GET'`** — never widen that to POST, or a retried run-start
creates duplicate Actor runs.

`apiRequest` also rewrites the `full-permission-actor-not-approved` error into an actionable
message. The approval URL is validated and goes only in `description` — n8n rewrites any
`message` containing an error code — as plain text for AI tools and an escaped `<a>` for the UI.

`pollRunStatus` is bounded — the run's own `timeoutSecs` plus a 5m grace, falling back to 24h
when the run reports no timeout, then it throws. Don't reintroduce unbounded polling. Timeout
constants live in `helpers/consts.ts`.

`executeAndLinkItems` owns the per-input-item loop, `pairedItem` linking, and `continueOnFail()`.
Input iteration there and in `executeActor` has caused duplicate-run regressions before, so
change it carefully. Because `continueOnFail` lives there, `Apify.node.ts#execute` carries an
intentional `require-continue-on-fail` eslint-disable — leave it.

### Node → resource → operation tree

`Apify.node.ts` is thin: properties from `Apify.properties.ts`, methods from `resources/index.ts`,
`execute` delegating to `resources/router.ts`. Both nodes set `usableAsTool: true`.

Every level of `nodes/Apify/resources/` repeats the same shape:

- **Operation folder** (`actors/run-actor/`) — `properties.ts`, `execute.ts`, `index.ts`
  (exports `name`, `option`, `properties`), `hooks.ts` (a transform point, mostly identity).
- **Resource folder** (`actors/`) — `index.ts` builds the Operation select from each operation's
  `option`; `router.ts` switches on `resource`/`operation` and calls the handler.
- **Top level** — `resources/index.ts` builds the Resource select over the five resources
  (`Actors`, `Actor tasks`, `Actor runs`, `Datasets`, `Key-Value Stores`) and merges all methods.

Resource and operation values are the human-readable strings (`'Actors'`, `'Run actor'`), used
verbatim in `displayOptions.show` and the router switches. Import the exported `name` constants
instead of retyping them.

### Resource locators — `resources/*ResourceLocator.ts`

`resources/hooks.ts` composes the `override*Properties` functions, which walk the assembled
property array and rewrite properties **by name** (`actorId`, `actorTaskId`, `runId`, `storeId`,
`recordKey`) into `resourceLocator`s, sometimes injecting a companion property such as
`actorSource`; the same files export the `listSearch` methods those locators call. So an
operation can declare a plain `string` `actorId` and still render as a searchable picker — and
property names matter more than their declared types.

### Run-starting operations — `resources/executeActor.ts`

Shared by `actors/run-actor`, `actors/run-actor-and-get-dataset`, `actor-tasks/run-task`,
`actor-tasks/run-task-and-get-dataset`: parse the input JSON (`customBodyParser` tolerates an
object, which AI Agent tool calls sometimes send), fetch the Actor, resolve the build, assemble
the query string, POST with `waitForFinish=0`, then poll separately when the caller waits.

`maxTotalChargeUsd` ("Maximum Cost per Run (USD)", `default: null`, `minValue: 0`) is hand-written
on all four and sent **only when non-null and `> 0`** — `0`/empty deliberately means no limit.
`Apify.node.spec.ts` asserts every run-starting operation exposes it, so add it to any new one.

### Trigger node — `ApifyTrigger.node.ts`

Self-contained: its own properties (reusing the Actor/task locator overrides) plus
`webhookMethods.default` against `/v2/webhooks`, with a deterministic idempotency key on create
and the webhook id kept in workflow static data. `normalizeEventTypes` expands the `any` option
into the four terminal `ACTOR.RUN.*` events.

## Adding an operation

1. Copy an existing operation folder; every property needs `displayOptions.show` for both
   `resource` and `operation`.
2. Register it in the resource's `index.ts` (`operations` array and `rawProperties`) and in its
   `router.ts` (import `name`, add a `case`).
3. If it starts a run, go through `executeActor` and add `maxTotalChargeUsd`.
4. Add a workflow fixture under `__tests__/workflows/<resource>/` and a `nock`-backed spec.

## Testing

Specs live in `nodes/Apify/__tests__/**/*.spec.ts` — excluded from the build, ignored by ESLint,
type-checked via `__tests__/tsconfig.json`. They drive the real node through
`__tests__/utils/executeWorkflow.ts`, a hand-rolled `IExecuteFunctions` stub that issues genuine
HTTP requests so `nock` can intercept them. Consequences:

- Fixtures are exported n8n workflow JSON. To test a non-default parameter, spread the fixture
  and override that node's `parameters` (see the `maxTotalChargeUsd` cases) — don't add a fixture.
- The stub's `getNodeParameter` mirrors n8n by falling back to the caller-supplied default
  (`node.parameters[name] ?? fallbackValue`). Don't "simplify" it to a bare lookup, or handlers
  that rely on defaults will see `undefined` in tests only.
- It wraps HTTP failures in a `NodeApiError` keeping the parsed body on `error.context.data`,
  which is what the permission-approval handling reads.
- Assert via `__tests__/utils/getNodeResultData.ts` and always check `scope.isDone()`.

## Conventions and gotchas

- **Never put `"AI"` in a codex `subcategories` block.** n8n's node creator drops *every* action
  for a node whose `codex.subcategories.AI` contains `Tools` without `Root Nodes`, so the node
  lands on the canvas with its default resource/operation instead of showing the action list —
  and it buys nothing, since AI Agent tool placement comes free from `usableAsTool: true` (n8n
  clones the node into `apifyTool` and stamps the AI codex itself). `subcategories.Tools` is safe.
- `nodes.config.js` (the `@n8n/node-cli` OpenAPI generator config) and `nodes/Apify/properties.json`
  are historical: `openapi.yaml`/`openapi.config.json` aren't in the repo, nothing imports
  `properties.json`, and `npm run merge:api` can't run as-is. The live properties are the
  hand-written `resources/**/properties.ts` — edit those.
- `package.json#main` is the empty `index.js` stub; n8n loads the compiled paths under the `n8n`
  field, so run `npm run build` before linking or testing in n8n. Never commit `dist/`.
- `Actors → Scrape single URL` returns page metadata plus **only** the selected `outputFormat`
  (`markdown` default / `html` / `text`). The scraper returns all three regardless of the
  `saveHtml`/`saveMarkdown` flags, so `execute.ts` strips them and re-adds the chosen one — keep
  that when adding fields, or the lean AI-tool output contract breaks. An `includeMetadata`
  toggle existed briefly and was reverted; don't re-add it.
- `key-value-stores/get-key-value-store-record` bypasses `apiRequest` and hard-codes `'apifyApi'`
  because it needs `returnFullResponse` + `encoding: 'arraybuffer'` for binary records, which
  `apiRequest`'s `json: true` precludes. It therefore ignores the `authentication` parameter.
- Keep base URLs in `helpers/consts.ts`; `ApifyApi.credentials.ts` imports `APIFY_API_URL` from
  there for its `/v2/users/me` credential test.
- Conventional Commits (`feat:`, `fix:`, `chore:`, `ci:`, `docs:`); PRs target `master`.
- Never bump the version by hand. Publishing a GitHub Release tagged `vX.Y.Z` triggers
  `publish.yml`: build, test, `npm version`, a signed `chore(release): … [skip ci]` commit, and
  `npm publish --provenance --access public`.
