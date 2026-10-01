# PR Overview: Fix form-data CRLF injection vulnerability

**What:** Fixes the Dependabot alert for `form-data` (GHSA-hmw2-7cc7-3qxx, CRLF/header injection via unescaped field names). `form-data` was only a transitive dependency (via `n8n-workflow`, `@n8n/node-cli`, `ibm-cloud-sdk-core`) — no direct dependency to bump.

**Approach:** Considered npm `overrides`, but that's blocked by n8n's own community-node lint rule (ineffective for isolated dependency trees). Instead, refreshed `package-lock.json` (`npm update @n8n/node-cli`) so all transitive copies resolve to patched `form-data@4.0.6`.

**Side effect:** This pulled `n8n-workflow` forward to 2.29.3, which added a couple of new required interface members. Updated two test helpers (`executeWorkflow.ts`, `credentialHelper.ts`) to match — no production code changed.

**Verification:** `tsc --noEmit`, lint, build, and full test suite (19/19) all pass; `npm audit` no longer reports the form-data alert.
