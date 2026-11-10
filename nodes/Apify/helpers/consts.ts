import type { IHttpRequestMethods } from 'n8n-workflow';

export const WEB_CONTENT_SCRAPER_ACTOR_ID = 'aYG0l9s7dbB7j3gbS';
export const APIFY_API_URL = 'https://api.apify.com';
export const APIFY_CONSOLE_URL = 'https://console.apify.com';
// Apify's 403 error type when the Actor's default build tag has no build.
export const MISSING_DEFAULT_BUILD_ERROR_TYPE = 'unknown-build-tag';
// Standby endpoint of the apify/web-fetch Actor (per the integrations-team contract).
export const WEB_FETCH_STANDBY_URL = 'https://web-fetch.apify.actor/';
// Every Server Actor's `standbyUrl` is on this domain. Requests carry the connection's token, so
// they're only sent to hosts that end with it.
export const APIFY_ACTOR_HOST_SUFFIX = '.apify.actor';
export const HTTP_METHODS: IHttpRequestMethods[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
// Server Actors for the Send Server Actor request picker, shaped like `GET /v2/store`.
// The Store API can't filter Server Actors yet, so this is a static snapshot in a key-value
// store (SERVER_ACTORS holds the full item shape, SERVER_ACTORS_SLIM only id, title, username
// and name). Once the filter ships, point this at the Store endpoint with it, e.g.
// '/v2/store?<server-actor filter>': `search`, `limit` and `offset` are already sent, and local
// search filtering switches off for any path that isn't a key-value store record. The Store API
// silently ignores unknown params, so check that `total` drops to the Server Actors (~2.4k).
export const SERVER_ACTORS_LIST_PATH =
	'/v2/key-value-stores/Cw412CNrZrtrhnoty/records/SERVER_ACTORS_SLIM';
export const TERMINAL_RUN_STATUSES = ['SUCCEEDED', 'FAILED', 'TIMED-OUT', 'ABORTED'];
export const WAIT_FOR_FINISH_POLL_INTERVAL = 1000;
// Per-request HTTP timeout (ms). Prevents a stalled socket from hanging the node indefinitely.
export const DEFAULT_REQUEST_TIMEOUT_MS = 60_000;
// Longer timeout for dataset item downloads, which can be large and slow to fully transfer.
export const DATASET_REQUEST_TIMEOUT_MS = 10 * 60 * 1000;
// Web Fetch renders a page in a single POST; a standby cold-start plus a slow page needs far
// more than the default 60s, and apiRequest does not retry POST network errors. Modelled on
// the dataset timeout and kept well above the 120s floor.
export const WEB_FETCH_REQUEST_TIMEOUT_MS = 10 * 60 * 1000;
// Timeout of a Send Server Actor request. Apify answers with a 504 after 300 s without a
// response; n8n's own 300 s default would fire ~0.4 s earlier with a misleading "server is
// offline" error, so wait a little longer and let Apify's answer arrive.
export const SERVER_ACTOR_REQUEST_TIMEOUT_MS = 310_000;
// Grace period added on top of a run's own `timeoutSecs` when polling
export const WAIT_FOR_FINISH_BUFFER_MS = 5 * 60 * 1000;
// Absolute ceiling for polling when a run has no timeout of its own (timeoutSecs = 0).
export const WAIT_FOR_FINISH_MAX_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day

export const memoryOptions = [
	{ name: '128 MB', value: 128 },
	{ name: '256 MB', value: 256 },
	{ name: '512 MB', value: 512 },
	{ name: '1024 MB (1 GB)', value: 1024 },
	{ name: '2048 MB (2 GB)', value: 2048 },
	{ name: '4096 MB (4 GB)', value: 4096 },
	{ name: '8192 MB (8 GB)', value: 8192 },
	{ name: '16384 MB (16 GB)', value: 16384 },
	{ name: '32768 MB (32 GB)', value: 32768 },
];

export const DEFAULT_EXP_BACKOFF_INTERVAL = 1;
export const DEFAULT_EXP_BACKOFF_EXPONENTIAL = 2;
export const DEFAULT_EXP_BACKOFF_RETRIES = 5;
