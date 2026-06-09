export const WEB_CONTENT_SCRAPER_ACTOR_ID = 'aYG0l9s7dbB7j3gbS';
export const APIFY_API_URL = 'https://api.apify.com';
export const TERMINAL_RUN_STATUSES = ['SUCCEEDED', 'FAILED', 'TIMED-OUT', 'ABORTED'];
export const WAIT_FOR_FINISH_POLL_INTERVAL = 1000;
// Per-request HTTP timeout (ms). Prevents a stalled socket from hanging the node indefinitely.
export const DEFAULT_REQUEST_TIMEOUT_MS = 60_000;
// Longer timeout for dataset item downloads, which can be large and slow to fully transfer.
export const DATASET_REQUEST_TIMEOUT_MS = 10 * 60 * 1000;
// Grace period added on top of a run's own `timeoutSecs` when polling
export const WAIT_FOR_FINISH_BUFFER_MS = 5 * 60 * 1000;
// Absolute ceiling for polling when a run has no timeout of its own (timeoutSecs = 0).
export const WAIT_FOR_FINISH_MAX_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

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
