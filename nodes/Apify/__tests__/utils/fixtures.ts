export const getRunResult = () => {
	return {
		id: 'c7Orwz5b830Tbp784',
		status: 'SUCCEEDED',
		actorId: 'some-actor-id',
		startedAt: '2023-01-01T00:00:00.000Z',
		finishedAt: '2023-01-01T00:10:00.000Z',
	};
};

export const getUserRunsListResult = () => {
	return [
		{
			id: 'pUahWTQWfyecyiV6u',
			actId: 'aYG0l9s7dbB7j3gbS',
			status: 'SUCCEEDED',
			startedAt: '2025-06-13T12:11:42.444Z',
			finishedAt: '2025-06-13T12:11:47.846Z',
			buildId: 'qd2nxvUfFzMmR7kTK',
			buildNumber: '0.3.66',
			meta: { origin: 'API' },
			defaultKeyValueStoreId: 'MmL3EM3jEzdW60GlP',
			defaultDatasetId: 'ivGqgfdxKrFlqK4gT',
			defaultRequestQueueId: '77egDqxz33RSapKL3',
		},
		{
			id: 'JCeKlCS34ybV7mUx0',
			actId: 'moJRLRc85AitArpNN',
			status: 'SUCCEEDED',
			startedAt: '2025-06-13T12:11:28.900Z',
			finishedAt: '2025-06-13T12:14:44.704Z',
			buildId: '9Mkjj0QLFkfY0LnzL',
			buildNumber: '3.0.19',
			meta: { origin: 'API' },
			defaultKeyValueStoreId: 'AeLkHLuU7oDb3GGV7',
			defaultDatasetId: 'ZjDL1gq6h13QH36qw',
			defaultRequestQueueId: 'pDGxGx4uCdFD4u1Wy',
		},
	];
};

export const getRunTaskResult = () => {
	return {
		id: '8Ai57jgykDRefjXZ2',
		actId: 'nFJndFXA5zjCTuudP',
		userId: 'A9zwKYff2yyRmaqc9',
		actorTaskId: 'PwUDLcG3zMyT8E4vq',
		startedAt: '2025-06-16T15:25:16.265Z',
		finishedAt: '2025-06-16T15:25:27.109Z',
		status: 'SUCCEEDED',
		statusMessage: 'Finished! Total 3 requests: 3 succeeded, 0 failed.',
		isStatusMessageTerminal: true,
		meta: {
			origin: 'API',
			userAgent: 'axios/1.7.4',
		},
		stats: {
			inputBodyLen: 345,
			migrationCount: 0,
			rebootCount: 0,
			restartCount: 0,
			durationMillis: 10703,
			resurrectCount: 0,
			runTimeSecs: 10.703,
			metamorph: 0,
			computeUnits: 0.0029730555555555556,
			memAvgBytes: 144937856.50460157,
			memMaxBytes: 193679360,
			memCurrentBytes: 193679360,
			cpuAvgUsage: 35.58816298251808,
			cpuMaxUsage: 162.73457249070634,
			cpuCurrentUsage: 18.094993710691824,
			netRxBytes: 1006262,
			netTxBytes: 388785,
		},
		options: {
			build: 'latest',
			timeoutSecs: 604800,
			memoryMbytes: 1024,
			maxTotalChargeUsd: 36.626132276924785,
			diskMbytes: 2048,
		},
		buildId: 'da2D8ovPHWBN98zj2',
		exitCode: 0,
		defaultKeyValueStoreId: 'UHiOej4hHyMaW4TCj',
		defaultDatasetId: 'c2FdVlC9kJuPexhYo',
		defaultRequestQueueId: 'auF0syp9TmancZy1a',
		pricingInfo: {
			pricingModel: 'PAY_PER_EVENT',
			reasonForChange:
				'We are introducing Store pricing discounts for this Actor and a new pricing model to give you more transparency and flexibility; more info in the follow-up email.',
			minimalMaxTotalChargeUsd: 0.5,
			createdAt: '2025-05-29T14:45:00.000Z',
			startedAt: '2025-06-10T08:00:00.000Z',
			apifyMarginPercentage: 0,
			notifiedAboutChangeAt: '2025-06-10T08:00:00.000Z',
			pricingPerEvent: {
				actorChargeEvents: {
					'actor-start': {
						eventTitle: 'Actor start',
						eventDescription: 'Flat fee for starting an Actor run.',
						eventPriceUsd: 0.0015,
					},
					'search-page-scraped': {
						eventTitle: 'Search results page scraped',
						eventDescription: 'Cost per page of Google Search results successfully scraped.',
						eventPriceUsd: 0.0035,
					},
					'ads-scraped': {
						eventTitle: 'Add-on: Paid results (ads) extraction',
						eventDescription:
							'Extra cost per page for attempting to extract paid results (ads) from Google Search. This applies when the ads extraction feature is enabled, regardless of whether ads are found on the specific page.',
						eventPriceUsd: 0.005,
					},
				},
			},
		},
		chargedEventCounts: {
			'actor-start': 1,
			'search-page-scraped': 2,
			'ads-scraped': 0,
		},
		platformUsageBillingModel: 'DEVELOPER',
		accountedChargedEventCounts: {
			'actor-start': 1,
			'search-page-scraped': 0,
			'ads-scraped': 0,
		},
		generalAccess: 'FOLLOW_USER_SETTING',
		buildNumber: '0.0.165',
		containerUrl: 'https://ygiq4orwxcrt.runs.apify.net',
		usageTotalUsd: 0.0015,
	};
};

export const getLastRunResult = () => {
	return [
		{
			data: {
				id: '8Ai57jgykDRefjXZ2',
				actId: 'nFJndFXA5zjCTuudP',
				userId: 'A9zwKYff2yyRmaqc9',
				actorTaskId: 'PwUDLcG3zMyT8E4vq',
				startedAt: '2025-06-16T15:25:16.265Z',
				finishedAt: '2025-06-16T15:25:27.109Z',
				status: 'SUCCEEDED',
				statusMessage: 'Finished! Total 3 requests: 3 succeeded, 0 failed.',
				isStatusMessageTerminal: true,
				meta: {
					origin: 'API',
					userAgent: 'axios/1.7.4',
				},
				stats: {
					inputBodyLen: 345,
					migrationCount: 0,
					rebootCount: 0,
					restartCount: 0,
					durationMillis: 10703,
					resurrectCount: 0,
					runTimeSecs: 10.703,
					metamorph: 0,
					computeUnits: 0.0029730555555555556,
					memAvgBytes: 144937856.50460157,
					memMaxBytes: 193679360,
					memCurrentBytes: 193679360,
					cpuAvgUsage: 35.58816298251808,
					cpuMaxUsage: 162.73457249070634,
					cpuCurrentUsage: 18.094993710691824,
					netRxBytes: 1006262,
					netTxBytes: 388785,
				},
				options: {
					build: 'latest',
					timeoutSecs: 604800,
					memoryMbytes: 1024,
					maxTotalChargeUsd: 36.626132276924785,
					diskMbytes: 2048,
				},
				buildId: 'da2D8ovPHWBN98zj2',
				exitCode: 0,
				defaultKeyValueStoreId: 'UHiOej4hHyMaW4TCj',
				defaultDatasetId: 'c2FdVlC9kJuPexhYo',
				defaultRequestQueueId: 'auF0syp9TmancZy1a',
				pricingInfo: {
					pricingModel: 'PAY_PER_EVENT',
					reasonForChange:
						'We are introducing Store pricing discounts for this Actor and a new pricing model to give you more transparency and flexibility; more info in the follow-up email.',
					minimalMaxTotalChargeUsd: 0.5,
					createdAt: '2025-05-29T14:45:00.000Z',
					startedAt: '2025-06-10T08:00:00.000Z',
					apifyMarginPercentage: 0,
					notifiedAboutChangeAt: '2025-06-10T08:00:00.000Z',
					pricingPerEvent: {
						actorChargeEvents: {
							'actor-start': {
								eventTitle: 'Actor start',
								eventDescription: 'Flat fee for starting an Actor run.',
								eventPriceUsd: 0.0015,
							},
							'search-page-scraped': {
								eventTitle: 'Search results page scraped',
								eventDescription: 'Cost per page of Google Search results successfully scraped.',
								eventPriceUsd: 0.0035,
							},
							'ads-scraped': {
								eventTitle: 'Add-on: Paid results (ads) extraction',
								eventDescription:
									'Extra cost per page for attempting to extract paid results (ads) from Google Search. This applies when the ads extraction feature is enabled, regardless of whether ads are found on the specific page.',
								eventPriceUsd: 0.005,
							},
						},
					},
				},
				chargedEventCounts: {
					'actor-start': 1,
					'search-page-scraped': 3,
					'ads-scraped': 0,
				},
				platformUsageBillingModel: 'DEVELOPER',
				accountedChargedEventCounts: {
					'actor-start': 1,
					'search-page-scraped': 3,
					'ads-scraped': 0,
				},
				generalAccess: 'FOLLOW_USER_SETTING',
				buildNumber: '0.0.165',
				containerUrl: 'https://ygiq4orwxcrt.runs.apify.net',
				usageTotalUsd: 0.012,
				consoleUrl: 'https://console.apify.com/view/runs/8Ai57jgykDRefjXZ2',
			},
		},
	];
};

export const runActorResult = () => {
	return [
		{
			data: {
				id: 'gbNI2e1oNCufgd5Rn',
				actId: 'nFJndFXA5zjCTuudP',
				userId: 'A9zwKYff2yyRmaqc9',
				startedAt: '2025-06-16T23:30:42.255Z',
				finishedAt: '2025-06-16T23:30:52.922Z',
				status: 'SUCCEEDED',
				statusMessage: 'Finished! Total 2 requests: 2 succeeded, 0 failed.',
				isStatusMessageTerminal: true,
				meta: {
					origin: 'API',
					userAgent: 'axios/1.7.4',
				},
				stats: {
					inputBodyLen: 336,
					migrationCount: 0,
					rebootCount: 0,
					restartCount: 0,
					durationMillis: 10476,
					resurrectCount: 0,
					runTimeSecs: 10.476,
					metamorph: 0,
					computeUnits: 0.00291,
					memAvgBytes: 128424657.84661157,
					memMaxBytes: 145063936,
					memCurrentBytes: 0,
					cpuAvgUsage: 15.432343907121574,
					cpuMaxUsage: 91.47420111042567,
					cpuCurrentUsage: 0,
					netRxBytes: 620882,
					netTxBytes: 467443,
				},
				options: {
					build: 'latest',
					timeoutSecs: 604800,
					memoryMbytes: 1024,
					maxTotalChargeUsd: 36.57444567272754,
					diskMbytes: 2048,
				},
				buildId: 'da2D8ovPHWBN98zj2',
				exitCode: 0,
				defaultKeyValueStoreId: 'K1AdT7nsdFw2ThD5J',
				defaultDatasetId: '6kTQQ34S3DftNqbE5',
				defaultRequestQueueId: '2cPPDy1XSk5k17yst',
				pricingInfo: {
					pricingModel: 'PAY_PER_EVENT',
					reasonForChange:
						'We are introducing Store pricing discounts for this Actor and a new pricing model to give you more transparency and flexibility; more info in the follow-up email.',
					minimalMaxTotalChargeUsd: 0.5,
					createdAt: '2025-05-29T14:45:00.000Z',
					startedAt: '2025-06-10T08:00:00.000Z',
					apifyMarginPercentage: 0,
					notifiedAboutChangeAt: '2025-06-10T08:00:00.000Z',
					pricingPerEvent: {
						actorChargeEvents: {
							'actor-start': {
								eventTitle: 'Actor start',
								eventDescription: 'Flat fee for starting an Actor run.',
								eventPriceUsd: 0.0015,
							},
							'search-page-scraped': {
								eventTitle: 'Search results page scraped',
								eventDescription: 'Cost per page of Google Search results successfully scraped.',
								eventPriceUsd: 0.0035,
							},
							'ads-scraped': {
								eventTitle: 'Add-on: Paid results (ads) extraction',
								eventDescription:
									'Extra cost per page for attempting to extract paid results (ads) from Google Search. This applies when the ads extraction feature is enabled, regardless of whether ads are found on the specific page.',
								eventPriceUsd: 0.005,
							},
						},
					},
				},
				chargedEventCounts: {
					'actor-start': 1,
					'search-page-scraped': 0,
					'ads-scraped': 0,
				},
				platformUsageBillingModel: 'DEVELOPER',
				accountedChargedEventCounts: {
					'actor-start': 1,
					'search-page-scraped': 0,
					'ads-scraped': 0,
				},
				generalAccess: 'FOLLOW_USER_SETTING',
				buildNumber: '0.0.165',
				containerUrl: 'https://xds5z9sxx8sx.runs.apify.net',
				usageTotalUsd: 0.0015,
			},
		},
	];
};

export const runScrapeSingleUrlActorResult = () => {
	return {
		data: {
			id: 'msR0goUocjDD8TEFc',
			actId: 'aYG0l9s7dbB7j3gbS',
			userId: 'A9zwKYff2yyRmaqc9',
			startedAt: '2025-06-17T09:36:34.357Z',
			finishedAt: '2025-06-17T09:36:40.823Z',
			status: 'SUCCEEDED',
			statusMessage: 'Finished! Total 1 requests: 1 succeeded, 0 failed.',
			isStatusMessageTerminal: true,
			meta: {
				origin: 'API',
				userAgent: 'axios/1.7.4',
			},
			stats: {
				inputBodyLen: 1288,
				migrationCount: 0,
				rebootCount: 0,
				restartCount: 0,
				durationMillis: 6255,
				resurrectCount: 0,
				runTimeSecs: 6.255,
				metamorph: 0,
				computeUnits: 0.0139,
				memAvgBytes: 222525318.18183225,
				memMaxBytes: 626765824,
				memCurrentBytes: 28999680,
				cpuAvgUsage: 129.49115775486143,
				cpuMaxUsage: 416.144,
				cpuCurrentUsage: 75.06281368821293,
				netRxBytes: 70258,
				netTxBytes: 33195,
			},
			options: {
				build: 'version-0',
				timeoutSecs: 360000,
				memoryMbytes: 8192,
				diskMbytes: 16384,
			},
			buildId: 'qd2nxvUfFzMmR7kTK',
			exitCode: 0,
			defaultKeyValueStoreId: 'LojdvKXYEvgsosK2p',
			defaultDatasetId: '3eiX51lRBOQJP58P8',
			defaultRequestQueueId: 'J77AdvLYBC2VzNRcJ',
			platformUsageBillingModel: 'USER',
			generalAccess: 'FOLLOW_USER_SETTING',
			buildNumber: '0.3.66',
			containerUrl: 'https://hrnfeqcf2oe2.runs.apify.net',
			usage: {
				ACTOR_COMPUTE_UNITS: 0.0139,
				DATASET_READS: 0,
				DATASET_WRITES: 0,
				KEY_VALUE_STORE_READS: 1,
				KEY_VALUE_STORE_WRITES: 1,
				KEY_VALUE_STORE_LISTS: 0,
				REQUEST_QUEUE_READS: 0,
				REQUEST_QUEUE_WRITES: 0,
				DATA_TRANSFER_INTERNAL_GBYTES: 0,
				DATA_TRANSFER_EXTERNAL_GBYTES: 0.00003091525286436081,
				PROXY_RESIDENTIAL_TRANSFER_GBYTES: 0,
				PROXY_SERPS: 0,
			},
			usageTotalUsd: 0.0056211830505728715,
			usageUsd: {
				ACTOR_COMPUTE_UNITS: 0.00556,
				DATASET_READS: 0,
				DATASET_WRITES: 0,
				KEY_VALUE_STORE_READS: 0.000005,
				KEY_VALUE_STORE_WRITES: 0.00005,
				KEY_VALUE_STORE_LISTS: 0,
				REQUEST_QUEUE_READS: 0,
				REQUEST_QUEUE_WRITES: 0,
				DATA_TRANSFER_INTERNAL_GBYTES: 0,
				DATA_TRANSFER_EXTERNAL_GBYTES: 0.000006183050572872162,
				PROXY_RESIDENTIAL_TRANSFER_GBYTES: 0,
				PROXY_SERPS: 0,
			},
		},
	};
};

export const getScrapeSingleUrlItemsResult = () => {
	return [
		{
			url: 'https://docs.apify.com/academy/web-scraping-for-beginners',
			crawl: {
				loadedUrl: 'https://docs.apify.com/academy/web-scraping-for-beginners',
				loadedTime: '2025-06-17T09:36:38.793Z',
				referrerUrl: 'https://docs.apify.com/academy/web-scraping-for-beginners',
				depth: 0,
				httpStatusCode: 200,
			},
			metadata: {
				canonicalUrl: 'https://docs.apify.com/academy/web-scraping-for-beginners',
				title: '',
				description:
					'Learn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.',
				author: null,
				keywords: null,
				languageCode: 'en',
				openGraph: [
					{
						property: 'og:url',
						content: 'https://docs.apify.com/academy/web-scraping-for-beginners',
					},
					{
						property: 'og:locale',
						content: 'en',
					},
					{
						property: 'og:title',
						content: 'Web scraping basics for JavaScript devs | Academy | Apify Documentation',
					},
					{
						property: 'og:description',
						content:
							'Learn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.',
					},
					{
						property: 'og:image',
						content:
							'https://apify.com/og-image/docs-article?title=Web+scraping+basics+for+JavaScript+devs',
					},
				],
				jsonLd: null,
				headers: {
					':status': 200,
					'content-type': 'text/html; charset=utf-8',
					'content-length': '9859',
					date: 'Tue, 17 Jun 2025 09:36:38 GMT',
					server: 'nginx',
					'last-modified': 'Tue, 17 Jun 2025 09:35:57 GMT',
					'access-control-allow-origin': '*',
					'strict-transport-security': 'max-age=31556952',
					etag: 'W/"685136fd-9443"',
					expires: 'Tue, 17 Jun 2025 09:46:38 GMT',
					'cache-control': 'max-age=600',
					'x-proxy-cache': 'MISS',
					'x-github-request-id': '2562:273E3A:12DD9CC:14D70EB:68513726',
					'accept-ranges': 'bytes',
					via: '1.1 varnish, 1.1 cfc2bdf486870ae2fbe33a1f02e28330.cloudfront.net (CloudFront)',
					'x-served-by': 'cache-iad-kcgs7200069-IAD',
					'x-cache-hits': '0',
					'x-timer': 'S1750152999.686991,VS0,VE13',
					'x-fastly-request-id': '28e08d66c4b3f1a68d7432bbcece70a110213e26',
					'x-frame-options': 'SAMEORIGIN',
					vary: 'Accept-Encoding',
					'x-cache': 'Miss from cloudfront',
					'x-amz-cf-pop': 'DFW57-P7',
					'x-amz-cf-id': '0bT72_AvfhIwa6rF7wjYuWmH93jUUG4JnCskGidKdzx8cfut4NOlaw==',
					age: '0',
				},
			},
			screenshotUrl: null,
			text: "Web scraping basics for JavaScript devs\nLearn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.\nWelcome to Web scraping basics for JavaScript devs, a comprehensive, practical and long form web scraping course that will take you from an absolute beginner to a successful web scraper developer. If you're looking for a quick start, we recommend trying this tutorial instead.\nThis course is made by Apify, the web scraping and automation platform, but we will use only open-source technologies throughout all academy lessons. This means that the skills you learn will be applicable to any scraping project, and you'll be able to run your scrapers on any computer. No Apify account needed.\nIf you would like to learn about the Apify platform and how it can help you build, run and scale your web scraping and automation projects, see the Apify platform course, where we'll teach you all about Apify serverless infrastructure, proxies, API, scheduling, webhooks and much more.\nWhy learn scraper development?​\nWith so many point-and-click tools and no-code software that can help you extract data from websites, what is the point of learning web scraper development? Contrary to what their marketing departments say, a point-and-click or no-code tool will never be as flexible, as powerful, or as optimized as a custom-built scraper.\nAny software can do only what it was programmed to do. If you build your own scraper, it can do anything you want. And you can always quickly change it to do more, less, or the same, but faster or cheaper. The possibilities are endless once you know how scraping really works.\nScraper development is a fun and challenging way to learn web development, web technologies, and understand the internet. You will reverse-engineer websites and understand how they work internally, what technologies they use and how they communicate with their servers. You will also master your chosen programming language and core programming concepts. When you truly understand web scraping, learning other technologies like React or Next.js will be a piece of cake.\nCourse Summary​\nWhen we set out to create the Academy, we wanted to build a complete guide to web scraping - a course that a beginner could use to create their first scraper, as well as a resource that professionals will continuously use to learn about advanced and niche web scraping techniques and technologies. All lessons include code examples and code-along exercises that you can use to immediately put your scraping skills into action.\nThis is what you'll learn in the Web scraping basics for JavaScript devs course:\nWeb scraping basics for JavaScript devs \nBasics of data extraction\nBasics of crawling\nBest practices\nRequirements​\nYou don't need to be a developer or a software engineer to complete this course, but basic programming knowledge is recommended. Don't be afraid, though. We explain everything in great detail in the course and provide external references that can help you level up your web scraping and web development skills. If you're new to programming, pay very close attention to the instructions and examples. A seemingly insignificant thing like using [] instead of () can make a lot of difference.\nIf you don't already have basic programming knowledge and would like to be well-prepared for this course, we recommend learning about JavaScript basics and CSS Selectors.\nAs you progress to the more advanced courses, the coding will get more challenging, but will still be manageable to a person with an intermediate level of programming skills.\nIdeally, you should have at least a moderate understanding of the following concepts:\nJavaScript + Node.js​\nIt is recommended to understand at least the fundamentals of JavaScript and be proficient with Node.js prior to starting this course. If you are not yet comfortable with asynchronous programming (with promises and async...await), loops (and the different types of loops in JavaScript), modularity, or working with external packages, we would recommend studying the following resources before coming back and continuing this section:\nasync...await (YouTube)\nJavaScript loops (MDN)\nModularity in Node.js\nGeneral web development​\nThroughout the next lessons, we will sometimes use certain technologies and terms related to the web without explaining them. This is because their knowledge will be assumed (unless we're showing something out of the ordinary).\nHTML\nHTTP protocol\nDevTools\njQuery or Cheerio​\nWe'll be using the Cheerio package a lot to parse data from HTML. This package provides an API using jQuery syntax to help traverse downloaded HTML within Node.js.\nNext up​\nThe course begins with a small bit of theory and moves into some realistic and practical examples of extracting data from the most popular websites on the internet using your browser console. Let's get to it!\nIf you already have experience with HTML, CSS, and browser DevTools, feel free to skip to the Basics of crawling section.",
			html: '<div id="readability-content"><h1>Web scraping basics for JavaScript devs</h1><div id="readability-page-1" class="page"><div><header></header>\n<p><strong>Learn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.</strong></p>\n<hr>\n<p>Welcome to <strong>Web scraping basics for JavaScript devs</strong>, a comprehensive, practical and long form web scraping course that will take you from an absolute beginner to a successful web scraper developer. If you\'re looking for a quick start, we recommend trying <a href="https://blog.apify.com/web-scraping-javascript-nodejs/" target="_blank" rel="noopener">this tutorial</a> instead.</p>\n<p>This course is made by <a href="https://apify.com/" target="_blank" rel="noopener">Apify</a>, the web scraping and automation platform, but we will use only open-source technologies throughout all academy lessons. This means that the skills you learn will be applicable to any scraping project, and you\'ll be able to run your scrapers on any computer. No Apify account needed.</p>\n<p>If you would like to learn about the Apify platform and how it can help you build, run and scale your web scraping and automation projects, see the <a href="https://docs.apify.com/academy/apify-platform">Apify platform course</a>, where we\'ll teach you all about Apify serverless infrastructure, proxies, API, scheduling, webhooks and much more.</p>\n<h2 id="why-learn">Why learn scraper development?<a href="#why-learn" aria-label="Direct link to Why learn scraper development?" title="Direct link to Why learn scraper development?">​</a></h2>\n<p>With so many point-and-click tools and no-code software that can help you extract data from websites, what is the point of learning web scraper development? Contrary to what their marketing departments say, a point-and-click or no-code tool will never be as flexible, as powerful, or as optimized as a custom-built scraper.</p>\n<p>Any software can do only what it was programmed to do. If you build your own scraper, it can do anything you want. And you can always quickly change it to do more, less, or the same, but faster or cheaper. The possibilities are endless once you know how scraping really works.</p>\n<p>Scraper development is a fun and challenging way to learn web development, web technologies, and understand the internet. You will reverse-engineer websites and understand how they work internally, what technologies they use and how they communicate with their servers. You will also master your chosen programming language and core programming concepts. When you truly understand web scraping, learning other technologies like React or Next.js will be a piece of cake.</p>\n<h2 id="summary">Course Summary<a href="#summary" aria-label="Direct link to Course Summary" title="Direct link to Course Summary">​</a></h2>\n<p>When we set out to create the Academy, we wanted to build a complete guide to web scraping - a course that a beginner could use to create their first scraper, as well as a resource that professionals will continuously use to learn about advanced and niche web scraping techniques and technologies. All lessons include code examples and code-along exercises that you can use to immediately put your scraping skills into action.</p>\n<p>This is what you\'ll learn in the <strong>Web scraping basics for JavaScript devs</strong> course:</p>\n<ul>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners">Web scraping basics for JavaScript devs</a>\n<ul>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/data-extraction">Basics of data extraction</a></li>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/crawling">Basics of crawling</a></li>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/best-practices">Best practices</a></li>\n</ul>\n</li>\n</ul>\n<h2 id="requirements">Requirements<a href="#requirements" aria-label="Direct link to Requirements" title="Direct link to Requirements">​</a></h2>\n<p>You don\'t need to be a developer or a software engineer to complete this course, but basic programming knowledge is recommended. Don\'t be afraid, though. We explain everything in great detail in the course and provide external references that can help you level up your web scraping and web development skills. If you\'re new to programming, pay very close attention to the instructions and examples. A seemingly insignificant thing like using <code>[]</code> instead of <code>()</code> can make a lot of difference.</p>\n<blockquote>\n<p>If you don\'t already have basic programming knowledge and would like to be well-prepared for this course, we recommend learning about <a href="https://developer.mozilla.org/en-US/curriculum/core/javascript-fundamentals/" target="_blank" rel="noopener">JavaScript basics</a> and <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors" target="_blank" rel="noopener">CSS Selectors</a>.</p>\n</blockquote>\n<p>As you progress to the more advanced courses, the coding will get more challenging, but will still be manageable to a person with an intermediate level of programming skills.</p>\n<p>Ideally, you should have at least a moderate understanding of the following concepts:</p>\n<h3 id="javascript-and-node">JavaScript + Node.js<a href="#javascript-and-node" aria-label="Direct link to JavaScript + Node.js" title="Direct link to JavaScript + Node.js">​</a></h3>\n<p>It is recommended to understand at least the fundamentals of JavaScript and be proficient with Node.js prior to starting this course. If you are not yet comfortable with asynchronous programming (with promises and <code>async...await</code>), loops (and the different types of loops in JavaScript), modularity, or working with external packages, we would recommend studying the following resources before coming back and continuing this section:</p>\n<ul>\n<li><a href="https://www.youtube.com/watch?v=vn3tm0quoqE&amp;ab_channel=Fireship" target="_blank" rel="noopener"><code>async...await</code> (YouTube)</a></li>\n<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration" target="_blank" rel="noopener">JavaScript loops (MDN)</a></li>\n<li><a href="https://javascript.plainenglish.io/how-to-use-modular-patterns-in-nodejs-982f0e5c8f6e" target="_blank" rel="noopener">Modularity in Node.js</a></li>\n</ul>\n<h3 id="general-web-development">General web development<a href="#general-web-development" aria-label="Direct link to General web development" title="Direct link to General web development">​</a></h3>\n<p>Throughout the next lessons, we will sometimes use certain technologies and terms related to the web without explaining them. This is because their knowledge will be <strong>assumed</strong> (unless we\'re showing something out of the ordinary).</p>\n<ul>\n<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener">HTML</a></li>\n<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP" target="_blank" rel="noopener">HTTP protocol</a></li>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/data-extraction/browser-devtools">DevTools</a></li>\n</ul>\n<h3 id="jquery-or-cheerio">jQuery or Cheerio<a href="#jquery-or-cheerio" aria-label="Direct link to jQuery or Cheerio" title="Direct link to jQuery or Cheerio">​</a></h3>\n<p>We\'ll be using the <a href="https://www.npmjs.com/package/cheerio" target="_blank" rel="noopener"><strong>Cheerio</strong></a> package a lot to parse data from HTML. This package provides an API using jQuery syntax to help traverse downloaded HTML within Node.js.</p>\n<h2 id="next">Next up<a href="#next" aria-label="Direct link to Next up" title="Direct link to Next up">​</a></h2>\n<p>The course begins with a small bit of theory and moves into some realistic and practical examples of extracting data from the most popular websites on the internet using your browser console. <a href="https://docs.apify.com/academy/web-scraping-for-beginners/introduction">Let\'s get to it!</a></p>\n<blockquote>\n<p>If you already have experience with HTML, CSS, and browser DevTools, feel free to skip to the <a href="https://docs.apify.com/academy/web-scraping-for-beginners/crawling">Basics of crawling</a> section.</p>\n</blockquote></div></div></div>',
			markdown:
				'# Web scraping basics for JavaScript devs\n\n**Learn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.**\n\n* * *\n\nWelcome to **Web scraping basics for JavaScript devs**, a comprehensive, practical and long form web scraping course that will take you from an absolute beginner to a successful web scraper developer. If you\'re looking for a quick start, we recommend trying [this tutorial](https://blog.apify.com/web-scraping-javascript-nodejs/) instead.\n\nThis course is made by [Apify](https://apify.com/), the web scraping and automation platform, but we will use only open-source technologies throughout all academy lessons. This means that the skills you learn will be applicable to any scraping project, and you\'ll be able to run your scrapers on any computer. No Apify account needed.\n\nIf you would like to learn about the Apify platform and how it can help you build, run and scale your web scraping and automation projects, see the [Apify platform course](https://docs.apify.com/academy/apify-platform), where we\'ll teach you all about Apify serverless infrastructure, proxies, API, scheduling, webhooks and much more.\n\n## Why learn scraper development?[​](#why-learn "Direct link to Why learn scraper development?")\n\nWith so many point-and-click tools and no-code software that can help you extract data from websites, what is the point of learning web scraper development? Contrary to what their marketing departments say, a point-and-click or no-code tool will never be as flexible, as powerful, or as optimized as a custom-built scraper.\n\nAny software can do only what it was programmed to do. If you build your own scraper, it can do anything you want. And you can always quickly change it to do more, less, or the same, but faster or cheaper. The possibilities are endless once you know how scraping really works.\n\nScraper development is a fun and challenging way to learn web development, web technologies, and understand the internet. You will reverse-engineer websites and understand how they work internally, what technologies they use and how they communicate with their servers. You will also master your chosen programming language and core programming concepts. When you truly understand web scraping, learning other technologies like React or Next.js will be a piece of cake.\n\n## Course Summary[​](#summary "Direct link to Course Summary")\n\nWhen we set out to create the Academy, we wanted to build a complete guide to web scraping - a course that a beginner could use to create their first scraper, as well as a resource that professionals will continuously use to learn about advanced and niche web scraping techniques and technologies. All lessons include code examples and code-along exercises that you can use to immediately put your scraping skills into action.\n\nThis is what you\'ll learn in the **Web scraping basics for JavaScript devs** course:\n\n*   [Web scraping basics for JavaScript devs](https://docs.apify.com/academy/web-scraping-for-beginners)\n    *   [Basics of data extraction](https://docs.apify.com/academy/web-scraping-for-beginners/data-extraction)\n    *   [Basics of crawling](https://docs.apify.com/academy/web-scraping-for-beginners/crawling)\n    *   [Best practices](https://docs.apify.com/academy/web-scraping-for-beginners/best-practices)\n\n## Requirements[​](#requirements "Direct link to Requirements")\n\nYou don\'t need to be a developer or a software engineer to complete this course, but basic programming knowledge is recommended. Don\'t be afraid, though. We explain everything in great detail in the course and provide external references that can help you level up your web scraping and web development skills. If you\'re new to programming, pay very close attention to the instructions and examples. A seemingly insignificant thing like using `[]` instead of `()` can make a lot of difference.\n\n> If you don\'t already have basic programming knowledge and would like to be well-prepared for this course, we recommend learning about [JavaScript basics](https://developer.mozilla.org/en-US/curriculum/core/javascript-fundamentals/) and [CSS Selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors).\n\nAs you progress to the more advanced courses, the coding will get more challenging, but will still be manageable to a person with an intermediate level of programming skills.\n\nIdeally, you should have at least a moderate understanding of the following concepts:\n\n### JavaScript + Node.js[​](#javascript-and-node "Direct link to JavaScript + Node.js")\n\nIt is recommended to understand at least the fundamentals of JavaScript and be proficient with Node.js prior to starting this course. If you are not yet comfortable with asynchronous programming (with promises and `async...await`), loops (and the different types of loops in JavaScript), modularity, or working with external packages, we would recommend studying the following resources before coming back and continuing this section:\n\n*   [`async...await` (YouTube)](https://www.youtube.com/watch?v=vn3tm0quoqE&ab_channel=Fireship)\n*   [JavaScript loops (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)\n*   [Modularity in Node.js](https://javascript.plainenglish.io/how-to-use-modular-patterns-in-nodejs-982f0e5c8f6e)\n\n### General web development[​](#general-web-development "Direct link to General web development")\n\nThroughout the next lessons, we will sometimes use certain technologies and terms related to the web without explaining them. This is because their knowledge will be **assumed** (unless we\'re showing something out of the ordinary).\n\n*   [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)\n*   [HTTP protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP)\n*   [DevTools](https://docs.apify.com/academy/web-scraping-for-beginners/data-extraction/browser-devtools)\n\n### jQuery or Cheerio[​](#jquery-or-cheerio "Direct link to jQuery or Cheerio")\n\nWe\'ll be using the [**Cheerio**](https://www.npmjs.com/package/cheerio) package a lot to parse data from HTML. This package provides an API using jQuery syntax to help traverse downloaded HTML within Node.js.\n\n## Next up[​](#next "Direct link to Next up")\n\nThe course begins with a small bit of theory and moves into some realistic and practical examples of extracting data from the most popular websites on the internet using your browser console. [Let\'s get to it!](https://docs.apify.com/academy/web-scraping-for-beginners/introduction)\n\n> If you already have experience with HTML, CSS, and browser DevTools, feel free to skip to the [Basics of crawling](https://docs.apify.com/academy/web-scraping-for-beginners/crawling) section.',
			debug: {
				requestHandlerMode: 'http',
			},
		},
	];
};

export const getActorResult = () => {
	return {
		data: {
			id: 'nFJndFXA5zjCTuudP',
			userId: 'ZscMwFR5H7eCtWtyh',
			name: 'google-search-scraper',
			username: 'apify',
			description:
				'Scrape Google Search Engine Results Pages (SERPs). Select the country or language and extract organic and paid results, AI overviews, ads, queries, People Also Ask, prices, reviews, like a Google SERP API. Export scraped data, run the scraper via API, schedule runs, or integrate with other tools.',
			restartOnError: true,
			isPublic: true,
			createdAt: '2019-02-18T11:03:13.744Z',
			modifiedAt: '2025-06-10T08:04:51.206Z',
			stats: {
				totalBuilds: 577,
				totalRuns: 33049616,
				totalUsers: 60924,
				lastRunStartedAt: '2025-06-17T08:57:22.280Z',
				totalMetamorphs: 15148,
				totalUsers30Days: 3417,
				totalUsers7Days: 1346,
				totalUsers90Days: 7232,
				publicActorRunStats30Days: {
					ABORTED: 941,
					FAILED: 25,
					SUCCEEDED: 1692145,
					'TIMED-OUT': 122,
					TOTAL: 1694508,
				},
			},
			versions: [],
			defaultRunOptions: {
				build: 'latest',
				timeoutSecs: 604800,
				memoryMbytes: 1024,
			},
			exampleRunInput: {
				body: '{ "helloWorld": 123 }',
				contentType: 'application/json; charset=utf-8',
			},
			categories: ['SEO_TOOLS', 'AI'],
			isDeprecated: false,
			title: 'Google Search Results Scraper',
			pictureUrl:
				'https://apify-image-uploads-prod.s3.amazonaws.com/nFJndFXA5zjCTuudP/9KjLxYgE4rKvKbr3M-Google_Search_Results_Scraper.png',
			seoTitle: 'Google Search scraper and SERP API 🔎',
			seoDescription:
				'Extract data from Google Search pages. Scrape organic results, ads, AI overviews, People Also Ask, prices, reviews from any country or language.',
			pricingInfos: [
				{
					pricingModel: 'PRICE_PER_DATASET_ITEM',
					pricePerUnitUsd: 0.0035,
					unitName: 'results',
					startedAt: '2024-05-14T00:00:00.000Z',
					createdAt: '2024-04-29T13:23:52.101Z',
					apifyMarginPercentage: 0.2,
					notifiedAboutFutureChangeAt: '2024-04-29T13:24:51.361Z',
					notifiedAboutChangeAt: '2024-05-14T00:06:22.078Z',
				},
				{
					pricingModel: 'PRICE_PER_DATASET_ITEM',
					reasonForChange: null,
					unitName: 'results',
					pricePerUnitUsd: 0.0010500000000000002,
					minimalMaxTotalChargeUsd: null,
					createdAt: '2024-12-12T18:32:20.774Z',
					startedAt: '2024-12-12T18:32:20.774Z',
					apifyMarginPercentage: 0.2,
					notifiedAboutChangeAt: '2024-12-12T19:39:18.761Z',
				},
				{
					pricingModel: 'PRICE_PER_DATASET_ITEM',
					reasonForChange: null,
					unitName: 'results',
					pricePerUnitUsd: 0.0035,
					minimalMaxTotalChargeUsd: null,
					createdAt: '2024-12-12T20:00:55.464Z',
					startedAt: '2024-12-12T20:00:55.464Z',
					apifyMarginPercentage: 0.2,
					notifiedAboutChangeAt: '2024-12-12T21:17:13.807Z',
				},
				{
					pricingModel: 'PAY_PER_EVENT',
					reasonForChange:
						'We are introducing Store pricing discounts for this Actor and a new pricing model to give you more transparency and flexibility; more info in the follow-up email.',
					pricingPerEvent: {
						actorChargeEvents: {
							'actor-start': {
								eventTitle: 'Actor start',
								eventDescription: 'Flat fee for starting an Actor run.',
								eventTieredPricingUsd: {
									FREE: {
										tieredEventPriceUsd: 0.002,
									},
									BRONZE: {
										tieredEventPriceUsd: 0.0015,
									},
									SILVER: {
										tieredEventPriceUsd: 0.0012,
									},
									GOLD: {
										tieredEventPriceUsd: 0.00105,
									},
									PLATINUM: {
										tieredEventPriceUsd: 0.00075075,
									},
									DIAMOND: {
										tieredEventPriceUsd: 0.0006006,
									},
								},
							},
							'search-page-scraped': {
								eventTitle: 'Search results page scraped',
								eventDescription: 'Cost per page of Google Search results successfully scraped.',
								eventTieredPricingUsd: {
									FREE: {
										tieredEventPriceUsd: 0.0045,
									},
									BRONZE: {
										tieredEventPriceUsd: 0.0035,
									},
									SILVER: {
										tieredEventPriceUsd: 0.0028,
									},
									GOLD: {
										tieredEventPriceUsd: 0.00245,
									},
									PLATINUM: {
										tieredEventPriceUsd: 0.00175175,
									},
									DIAMOND: {
										tieredEventPriceUsd: 0.0014014,
									},
								},
							},
							'ads-scraped': {
								eventTitle: 'Add-on: Paid results (ads) extraction',
								eventDescription:
									'Extra cost per page for attempting to extract paid results (ads) from Google Search. This applies when the ads extraction feature is enabled, regardless of whether ads are found on the specific page.',
								eventTieredPricingUsd: {
									FREE: {
										tieredEventPriceUsd: 0.0065,
									},
									BRONZE: {
										tieredEventPriceUsd: 0.005,
									},
									SILVER: {
										tieredEventPriceUsd: 0.004,
									},
									GOLD: {
										tieredEventPriceUsd: 0.0035,
									},
									PLATINUM: {
										tieredEventPriceUsd: 0.0025025,
									},
									DIAMOND: {
										tieredEventPriceUsd: 0.002002,
									},
								},
							},
						},
					},
					minimalMaxTotalChargeUsd: 0.5,
					createdAt: '2025-05-29T14:45:00.000Z',
					startedAt: '2025-06-10T08:00:00.000Z',
					apifyMarginPercentage: 0,
					notifiedAboutChangeAt: '2025-06-10T08:00:00.000Z',
				},
			],
			notice: 'NONE',
			isCritical: true,
			isGeneric: false,
			hasNoDataset: false,
			isSourceCodeHidden: true,
			deploymentKey:
				'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDGYLv22LiuZq9tGQM7Y44VZro1aXnu9x3JnvgIIEwyC7u5B80X0L6mk1JfZHZbAhq2NU4pYgNE98WFPjKaDiS1hLCYjWazRWBZcbhrkeOW+QtROA1sb0bfcpuW1HIdqwZ6YNcUptL7U6Z6FaQcT9qe7Il+8kKAlbdovaa/zS+XM79Vb8xvfiY4iaTrwuZr6KDhPjT7Yswxiv7Luzc6TxkIixyNuKqmvqNvhqS748KVdlMIH0UgWRSpERMLm9HhK2G+b3XEzEHeESof1vC4rtbSGoQ/28s9JdGh0pkYBFPa2wJsqlRF0/VSh7R1lGbnDZRwz/Kw5FxXb53vq55oSjXH \n',
			taggedBuilds: {
				latest: {
					buildId: 'da2D8ovPHWBN98zj2',
					buildNumber: '0.0.165',
					finishedAt: '2025-06-10T08:04:51.206Z',
				},
			},
		},
	};
};

export const getBuildResult = () => {
	return {
		id: 'da2D8ovPHWBN98zj2',
		actId: 'nFJndFXA5zjCTuudP',
		userId: 'ZscMwFR5H7eCtWtyh',
		startedAt: '2025-06-10T08:03:42.644Z',
		finishedAt: '2025-06-10T08:04:51.206Z',
		status: 'SUCCEEDED',
		meta: {
			origin: 'WEB',
			userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:138.0) Gecko/20100101 Firefox/138.0',
		},
		stats: {
			durationMillis: 68452,
			runTimeSecs: 68.452,
			computeUnits: 0.07605777777777778,
			imageSizeBytes: 2392065651,
		},
		options: {
			useCache: true,
			betaPackages: false,
			memoryMbytes: 4096,
			diskMbytes: 8192,
		},
		exitCode: 0,
		inputSchema:
			'{\n  "title": "Google Search Scraper input",\n  "description": "Use this search the same way you would use Google, you can e.g. look for <code>cute cats</code>. Use a new line for each query. \\n Click &#9655; <strong> Start </strong> to begin the scrape. If you need any guidance, just <a href=\'https://blog.apify.com/unofficial-google-search-api-from-apify-22a20537a951/#how-to-scrape-google-search-pages\' target=\'_blank\' rel=\'noopener\'>follow this tutorial.</a>",\n  "type": "object",\n  "schemaVersion": 1,\n  "properties": {\n    "queries": {\n      "title": "Search term(s)",\n      "type": "string",\n      "description": "Use regular search words or enter Google Search URLs. You can also apply [advanced Google search techniques](https://blog.apify.com/how-to-scrape-google-like-a-pro/), such as <code>AI site:twitter.com</code> or <code>javascript OR python</code>. You can also define selected search filters as separate fields below (in the <code>Advanced search filters</code> section). Just ensure that your queries do not exceed 32 words to comply with Google Search limits.",\n      "prefill": "javascript\\ntypescript\\npython",\n      "editor": "textarea",\n      "pattern": "[^\\\\s]+"\n    },\n    "resultsPerPage": {\n      "title": "Results per page",\n      "type": "integer",\n      "description": "",\n      "maximum": 100,\n      "minimum": 1,\n      "prefill": 100,\n      "sectionCaption": "Number of results",\n      "sectionDescription": "Google usually returns about 200 results per search. By default it displays about 20-30 pages with 10 results per page, but you can switch it to display 100 results - and then Google will only show 2 to 3 pages. \\n This is a more efficient option for scraping as you get more results with one request."\n    },\n    "maxPagesPerQuery": {\n      "title": "Max pages per search",\n      "type": "integer",\n      "description": "",\n      "prefill": 1,\n      "minimum": 1\n    },\n    "focusOnPaidAds": {\n      "title": "Add-on: Enable paid results (ads) extraction",\n      "type": "boolean",\n      "description": "Enable extraction of paid results (Google Ads). This feature improves ad detection accuracy by using an ad-specialized proxy to perform 3 checks on each search page. Best used for queries likely to show ads. Extra cost per search page applies when enabled, regardless of ads found. Pricing depends on your Apify subscription plan.",\n      "default": false,\n      "sectionCaption": "📢 Add-on: Paid results (ads) extraction",\n      "sectionDescription": "How it works:</b> When enabled, for each processed search page, the Actor performs a sequence of 3 checks using an <b>ad-specialized proxy server</b> to determine if paid advertisements are present. This 3-check process ensures higher <b>accuracy</b> in determining the presence or absence of ads on that search page. <br><br><b>Usage Recommendation:</b> This feature is most effective and cost-efficient when used for search queries that have a high probability of displaying ads. Avoid enabling it for general scraping tasks where ads are not a primary focus to optimize your costs. <br><br><b>Important:</b> An extra cost applies per search page for invoking this 3-check ad detection process when the feature is active. This cost is incurred even if no ads are found, as the value lies in the comprehensive check. The specific price for this add-on varies based on your Apify subscription plan. Please refer to your subscription details in the Apify Console."\n    },\n    "countryCode": {\n      "sectionCaption": "Location and language",\n      "title": "Country",\n      "type": "string",\n      "description": "Specifies the country used for the search and the Google Search domain (e.g. <code>google.es</code> for Spain). By default, the actor uses United States (<code>google.com</code>).",\n      "editor": "select",\n      "enum": [\n        "",\n        "af",\n        "al",\n        "dz",\n        "as",\n        "ad",\n        "ao",\n        "ai",\n        "aq",\n        "ag",\n        "ar",\n        "am",\n        "aw",\n        "au",\n        "at",\n        "az",\n        "bs",\n        "bh",\n        "bd",\n        "bb",\n        "by",\n        "be",\n        "bz",\n        "bj",\n        "bm",\n        "bt",\n        "bo",\n        "ba",\n        "bw",\n        "bv",\n        "br",\n        "io",\n        "bn",\n        "bg",\n        "bf",\n        "bi",\n        "kh",\n        "cm",\n        "ca",\n        "cv",\n        "ky",\n        "cf",\n        "td",\n        "cl",\n        "cn",\n        "cx",\n        "cc",\n        "co",\n        "km",\n        "cg",\n        "cd",\n        "ck",\n        "cr",\n        "ci",\n        "hr",\n        "cu",\n        "cy",\n        "cz",\n        "dk",\n        "dj",\n        "dm",\n        "do",\n        "ec",\n        "eg",\n        "sv",\n        "gq",\n        "er",\n        "ee",\n        "et",\n        "fk",\n        "fo",\n        "fj",\n        "fi",\n        "fr",\n        "gf",\n        "pf",\n        "tf",\n        "ga",\n        "gm",\n        "ge",\n        "de",\n        "gh",\n        "gi",\n        "gr",\n        "gl",\n        "gd",\n        "gp",\n        "gu",\n        "gt",\n        "gn",\n        "gw",\n        "gy",\n        "ht",\n        "hm",\n        "va",\n        "hn",\n        "hk",\n        "hu",\n        "is",\n        "in",\n        "id",\n        "ir",\n        "iq",\n        "ie",\n        "il",\n        "it",\n        "jm",\n        "jp",\n        "jo",\n        "kz",\n        "ke",\n        "ki",\n        "kp",\n        "kr",\n        "kw",\n        "kg",\n        "la",\n        "lv",\n        "lb",\n        "ls",\n        "lr",\n        "ly",\n        "li",\n        "lt",\n        "lu",\n        "mo",\n        "mk",\n        "mg",\n        "mw",\n        "my",\n        "mv",\n        "ml",\n        "mt",\n        "mh",\n        "mq",\n        "mr",\n        "mu",\n        "yt",\n        "mx",\n        "fm",\n        "md",\n        "mc",\n        "mn",\n        "ms",\n        "ma",\n        "mz",\n        "mm",\n        "na",\n        "nr",\n        "np",\n        "nl",\n        "an",\n        "nc",\n        "nz",\n        "ni",\n        "ne",\n        "ng",\n        "nu",\n        "nf",\n        "mp",\n        "no",\n        "om",\n        "pk",\n        "pw",\n        "ps",\n        "pa",\n        "pg",\n        "py",\n        "pe",\n        "ph",\n        "pn",\n        "pl",\n        "pt",\n        "pr",\n        "qa",\n        "re",\n        "ro",\n        "ru",\n        "rw",\n        "sh",\n        "kn",\n        "lc",\n        "pm",\n        "vc",\n        "ws",\n        "sm",\n        "st",\n        "sa",\n        "sn",\n        "cs",\n        "sc",\n        "sl",\n        "sg",\n        "sk",\n        "si",\n        "sb",\n        "so",\n        "za",\n        "gs",\n        "es",\n        "lk",\n        "sd",\n        "sr",\n        "sj",\n        "sz",\n        "se",\n        "ch",\n        "sy",\n        "tw",\n        "tj",\n        "tz",\n        "th",\n        "tl",\n        "tg",\n        "tk",\n        "to",\n        "tt",\n        "tn",\n        "tr",\n        "tm",\n        "tc",\n        "tv",\n        "ug",\n        "ua",\n        "ae",\n        "gb",\n        "us",\n        "um",\n        "uy",\n        "uz",\n        "vu",\n        "ve",\n        "vn",\n        "vg",\n        "vi",\n        "wf",\n        "eh",\n        "ye",\n        "zm",\n        "zw"\n      ],\n      "enumTitles": [\n        "Default (United States)",\n        "Afghanistan",\n        "Albania",\n        "Algeria",\n        "American Samoa",\n        "Andorra",\n        "Angola",\n        "Anguilla",\n        "Antarctica",\n        "Antigua and Barbuda",\n        "Argentina",\n        "Armenia",\n        "Aruba",\n        "Australia",\n        "Austria",\n        "Azerbaijan",\n        "Bahamas",\n        "Bahrain",\n        "Bangladesh",\n        "Barbados",\n        "Belarus",\n        "Belgium",\n        "Belize",\n        "Benin",\n        "Bermuda",\n        "Bhutan",\n        "Bolivia",\n        "Bosnia and Herzegovina",\n        "Botswana",\n        "Bouvet Island",\n        "Brazil",\n        "British Indian Ocean Territory",\n        "Brunei Darussalam",\n        "Bulgaria",\n        "Burkina Faso",\n        "Burundi",\n        "Cambodia",\n        "Cameroon",\n        "Canada",\n        "Cape Verde",\n        "Cayman Islands",\n        "Central African Republic",\n        "Chad",\n        "Chile",\n        "China",\n        "Christmas Island",\n        "Cocos (Keeling) Islands",\n        "Colombia",\n        "Comoros",\n        "Congo",\n        "Congo, the Democratic Republic of the",\n        "Cook Islands",\n        "Costa Rica",\n        "Cote D\'ivoire",\n        "Croatia",\n        "Cuba",\n        "Cyprus",\n        "Czech Republic",\n        "Denmark",\n        "Djibouti",\n        "Dominica",\n        "Dominican Republic",\n        "Ecuador",\n        "Egypt",\n        "El Salvador",\n        "Equatorial Guinea",\n        "Eritrea",\n        "Estonia",\n        "Ethiopia",\n        "Falkland Islands (Malvinas)",\n        "Faroe Islands",\n        "Fiji",\n        "Finland",\n        "France",\n        "French Guiana",\n        "French Polynesia",\n        "French Southern Territories",\n        "Gabon",\n        "Gambia",\n        "Georgia",\n        "Germany",\n        "Ghana",\n        "Gibraltar",\n        "Greece",\n        "Greenland",\n        "Grenada",\n        "Guadeloupe",\n        "Guam",\n        "Guatemala",\n        "Guinea",\n        "Guinea-Bissau",\n        "Guyana",\n        "Haiti",\n        "Heard Island and Mcdonald Islands",\n        "Holy See (Vatican City State)",\n        "Honduras",\n        "Hong Kong",\n        "Hungary",\n        "Iceland",\n        "India",\n        "Indonesia",\n        "Iran, Islamic Republic of",\n        "Iraq",\n        "Ireland",\n        "Israel",\n        "Italy",\n        "Jamaica",\n        "Japan",\n        "Jordan",\n        "Kazakhstan",\n        "Kenya",\n        "Kiribati",\n        "Korea, Democratic People\'s Republic of",\n        "Korea, Republic of",\n        "Kuwait",\n        "Kyrgyzstan",\n        "Lao People\'s Democratic Republic",\n        "Latvia",\n        "Lebanon",\n        "Lesotho",\n        "Liberia",\n        "Libyan Arab Jamahiriya",\n        "Liechtenstein",\n        "Lithuania",\n        "Luxembourg",\n        "Macao",\n        "Macedonia, the Former Yugoslav Republic of",\n        "Madagascar",\n        "Malawi",\n        "Malaysia",\n        "Maldives",\n        "Mali",\n        "Malta",\n        "Marshall Islands",\n        "Martinique",\n        "Mauritania",\n        "Mauritius",\n        "Mayotte",\n        "Mexico",\n        "Micronesia, Federated States of",\n        "Moldova, Republic of",\n        "Monaco",\n        "Mongolia",\n        "Montserrat",\n        "Morocco",\n        "Mozambique",\n        "Myanmar",\n        "Namibia",\n        "Nauru",\n        "Nepal",\n        "Netherlands",\n        "Netherlands Antilles",\n        "New Caledonia",\n        "New Zealand",\n        "Nicaragua",\n        "Niger",\n        "Nigeria",\n        "Niue",\n        "Norfolk Island",\n        "Northern Mariana Islands",\n        "Norway",\n        "Oman",\n        "Pakistan",\n        "Palau",\n        "Palestinian Territory, Occupied",\n        "Panama",\n        "Papua New Guinea",\n        "Paraguay",\n        "Peru",\n        "Philippines",\n        "Pitcairn",\n        "Poland",\n        "Portugal",\n        "Puerto Rico",\n        "Qatar",\n        "Reunion",\n        "Romania",\n        "Russian Federation",\n        "Rwanda",\n        "Saint Helena",\n        "Saint Kitts and Nevis",\n        "Saint Lucia",\n        "Saint Pierre and Miquelon",\n        "Saint Vincent and the Grenadines",\n        "Samoa",\n        "San Marino",\n        "Sao Tome and Principe",\n        "Saudi Arabia",\n        "Senegal",\n        "Serbia and Montenegro",\n        "Seychelles",\n        "Sierra Leone",\n        "Singapore",\n        "Slovakia",\n        "Slovenia",\n        "Solomon Islands",\n        "Somalia",\n        "South Africa",\n        "South Georgia and the South Sandwich Islands",\n        "Spain",\n        "Sri Lanka",\n        "Sudan",\n        "Suriname",\n        "Svalbard and Jan Mayen",\n        "Swaziland",\n        "Sweden",\n        "Switzerland",\n        "Syrian Arab Republic",\n        "Taiwan, Province of China",\n        "Tajikistan",\n        "Tanzania, United Republic of",\n        "Thailand",\n        "Timor-Leste",\n        "Togo",\n        "Tokelau",\n        "Tonga",\n        "Trinidad and Tobago",\n        "Tunisia",\n        "Turkey",\n        "Turkmenistan",\n        "Turks and Caicos Islands",\n        "Tuvalu",\n        "Uganda",\n        "Ukraine",\n        "United Arab Emirates",\n        "United Kingdom",\n        "United States",\n        "United States Minor Outlying Islands",\n        "Uruguay",\n        "Uzbekistan",\n        "Vanuatu",\n        "Venezuela",\n        "Viet Nam",\n        "Virgin Islands, British",\n        "Virgin Islands, U.S.",\n        "Wallis and Futuna",\n        "Western Sahara",\n        "Yemen",\n        "Zambia",\n        "Zimbabwe"\n      ]\n    },\n    "searchLanguage": {\n      "title": "Search language",\n      "type": "string",\n      "description": "Restricts search results to pages in a specific language. For example, choosing \'German\' results in pages only in German. Passed to Google Search as the <code>lr</code> URL query parameter. <a href=\'https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list\' target=\'_blank\'>Read more here</a>.",\n      "default": "",\n      "editor": "select",\n      "enum": [\n        "",\n        "ar",\n        "bg",\n        "ca",\n        "cs",\n        "da",\n        "de",\n        "el",\n        "en",\n        "es",\n        "et",\n        "fi",\n        "fr",\n        "hr",\n        "hu",\n        "id",\n        "is",\n        "it",\n        "iw",\n        "ja",\n        "ko",\n        "lt",\n        "lv",\n        "nl",\n        "no",\n        "pl",\n        "pt",\n        "ro",\n        "ru",\n        "sk",\n        "sl",\n        "sr",\n        "sv",\n        "tr",\n        "zh-CN",\n        "zh-TW"\n      ],\n      "enumTitles": [\n        "Default",\n        "Arabic",\n        "Bulgarian",\n        "Catalan",\n        "Czech",\n        "Danish",\n        "German",\n        "Greek",\n        "English",\n        "Spanish",\n        "Estonian",\n        "Finnish",\n        "French",\n        "Croatian",\n        "Hungarian",\n        "Indonesian",\n        "Icelandic",\n        "Italian",\n        "Hebrew",\n        "Japanese",\n        "Korean",\n        "Lithuanian",\n        "Latvian",\n        "Dutch",\n        "Norwegian",\n        "Polish",\n        "Portuguese",\n        "Romanian",\n        "Russian",\n        "Slovak",\n        "Slovenian",\n        "Serbian",\n        "Swedish",\n        "Turkish",\n        "Chinese (Simplified)",\n        "Chinese (Traditional)"\n      ]\n    },\n    "languageCode": {\n      "title": "Interface Language",\n      "type": "string",\n      "description": "Language of the Google Search interface (menus, buttons, etc. - not the search results themselves). Passed to Google Search as the <code>hl</code> URL query parameter. From Google Reference: You can use the <code>hl</code> request parameter to identify the language of your graphical interface. The <code>hl</code> parameter value may affect search results, especially on international queries when language restriction (using the <code>lr</code> parameter) is not explicitly specified. <a href=\'https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list\' target=\'_blank\'>Read more here</a>.",\n      "default": "",\n      "editor": "select",\n      "enum": [\n        "",\n        "af",\n        "sq",\n        "sm",\n        "ar",\n        "az",\n        "eu",\n        "be",\n        "bn",\n        "bh",\n        "bs",\n        "bg",\n        "ca",\n        "zh-CN",\n        "zh-TW",\n        "hr",\n        "cs",\n        "da",\n        "nl",\n        "en",\n        "eo",\n        "et",\n        "fo",\n        "fi",\n        "fr",\n        "fy",\n        "gl",\n        "ka",\n        "de",\n        "el",\n        "gu",\n        "iw",\n        "hi",\n        "hu",\n        "is",\n        "id",\n        "ia",\n        "ga",\n        "it",\n        "ja",\n        "jw",\n        "kn",\n        "ko",\n        "la",\n        "lv",\n        "lt",\n        "mk",\n        "ms",\n        "ml",\n        "mt",\n        "mr",\n        "ne",\n        "no",\n        "nn",\n        "oc",\n        "fa",\n        "pl",\n        "pt-BR",\n        "pt-PT",\n        "pa",\n        "ro",\n        "ru",\n        "gd",\n        "sr",\n        "si",\n        "sk",\n        "sl",\n        "es",\n        "su",\n        "sw",\n        "sv",\n        "tl",\n        "ta",\n        "te",\n        "th",\n        "ti",\n        "tr",\n        "uk",\n        "ur",\n        "uz",\n        "vi",\n        "cy",\n        "xh",\n        "zu"\n      ],\n      "enumTitles": [\n        "Same as country",\n        "Afrikaans",\n        "Albanian",\n        "Amharic",\n        "Arabic",\n        "Azerbaijani",\n        "Basque",\n        "Belarusian",\n        "Bengali",\n        "Bihari",\n        "Bosnian",\n        "Bulgarian",\n        "Catalan",\n        "Chinese (Simplified)",\n        "Chinese (Traditional)",\n        "Croatian",\n        "Czech",\n        "Danish",\n        "Dutch",\n        "English",\n        "Esperanto",\n        "Estonian",\n        "Faroese",\n        "Finnish",\n        "French",\n        "Frisian",\n        "Galician",\n        "Georgian",\n        "German",\n        "Greek",\n        "Gujarati",\n        "Hebrew",\n        "Hindi",\n        "Hungarian",\n        "Icelandic",\n        "Indonesian",\n        "Interlingua",\n        "Irish",\n        "Italian",\n        "Japanese",\n        "Javanese",\n        "Kannada",\n        "Korean",\n        "Latin",\n        "Latvian",\n        "Lithuanian",\n        "Macedonian",\n        "Malay",\n        "Malayam",\n        "Maltese",\n        "Marathi",\n        "Nepali",\n        "Norwegian",\n        "Norwegian (Nynorsk)",\n        "Occitan",\n        "Persian",\n        "Polish",\n        "Portuguese (Brazil)",\n        "Portuguese (Portugal)",\n        "Punjabi",\n        "Romanian",\n        "Russian",\n        "Scots Gaelic",\n        "Serbian",\n        "Sinhalese",\n        "Slovak",\n        "Slovenian",\n        "Spanish",\n        "Sudanese",\n        "Swahili",\n        "Swedish",\n        "Tagalog",\n        "Tamil",\n        "Telugu",\n        "Thai",\n        "Tigrinya",\n        "Turkish",\n        "Ukrainian",\n        "Urdu",\n        "Uzbek",\n        "Vietnamese",\n        "Welsh",\n        "Xhosa",\n        "Zulu"\n      ]\n    },\n    "locationUule": {\n      "title": "Exact location (Google UULE parameter)",\n      "type": "string",\n      "description": "The code for the exact location for the Google search. It\'s passed to Google Search as the <code>uule</code> URL query parameter. You can use the <a href=\'https://padavvan.github.io/\' target=\'_blank\'>UULE code generator</a>. Learn more about <a href=\'https://moz.com/ugc/geolocation-the-ultimate-tip-to-emulate-local-search\' target=\'_blank\'>emulating local search</a>.",\n      "editor": "textfield"\n    },\n    "forceExactMatch": {\n      "title": "Force exact match",\n      "type": "boolean",\n      "description": "If checked, the scraper will search for the exact phrase in the query. This is done by wrapping the query in quotes. Note that this may return fewer results. Also note that if you\'re using operators such as OR or AND, the whole query will be wrapped in quotes, such as <code>\\"Windows AND macOS\\"</code>. If you want to search for queries such as <code>\\"Windows\\" AND \\"macOS\\"</code>, you need to specify them directly in the <code>queries</code> field.",\n      "default": false,\n      "sectionCaption": "Advanced search filters",\n      "sectionDescription": "Use these filters to narrow down your search results. You can use them in combination with your search terms above. Each filter will be applied to all queries except for the ones that already contain the given filter. For example, if you have a query <code>literature site:example.com</code>, the <code>site</code> filter will not be applied to it."\n    },\n    "site": {\n      "title": "Site",\n      "type": "string",\n      "description": "Limits the search to a specific site, such as: <code>site:example.com</code>. Note that the <code>site</code> filter takes precedence over the <code>relatedToSite</code> filter. If both filters are set, the <code>relatedToSite</code> filter will be ignored and not added to the search queries.",\n      "editor": "textfield",\n      "pattern": "^([\\\\w-]+\\\\.)+\\\\w+$"\n    },\n    "relatedToSite": {\n      "title": "Related to site",\n      "type": "string",\n      "description": "Filters pages related to a specific site, such as: <code>related:example.com</code>. Note that the <code>site</code> filter takes precedence over the <code>relatedToSite</code> filter. If both filters are set, the <code>relatedToSite</code> filter will be ignored and not added to the search queries.",\n      "editor": "textfield",\n      "pattern": "^([\\\\w-]+\\\\.)+\\\\w+$"\n    },\n    "wordsInTitle": {\n      "title": "Words in title",\n      "type": "array",\n      "description": "Filters pages with specific words in the title. The scraper uses the <code>intitle:</code> operator, even for multiple words (e.g. <code>recipe site:allrecipes.com intitle:\\"easy apple\\" intitle:pie</code>). There\'s also a <code>allintitle:</code> operator available, but it\'s problematic when combined with other search filters, so the scraper avoids using it. If you need to use the <code>allintitle:</code> operator specifically, you can include it in your custom queries from the <code>queries</code> field.",\n      "editor": "stringList",\n      "patternValue": "^[^\\\\s](.+[^\\\\s])*$",\n      "maxItems": 32,\n      "default": []\n    },\n    "wordsInText": {\n      "title": "Words in text",\n      "type": "array",\n      "description": "Filters pages with specific words in the text. The scraper uses the <code>intext:</code> operator, even for multiple words (e.g. <code>cartoon site:wikipedia.com intext:cat intext:mouse</code>). There\'s also a <code>allintext:</code> operator available, but it\'s problematic when combined with other search filters, so the scraper avoids using it. If you need to use the <code>allintext:</code> operator specifically, you can include it in your custom queries from the <code>queries</code> field.",\n      "editor": "stringList",\n      "patternValue": "^[^\\\\s](.+[^\\\\s])*$",\n      "maxItems": 32,\n      "default": []\n    },\n    "wordsInUrl": {\n      "title": "Words in URL",\n      "type": "array",\n      "description": "Filters pages with specific words in the URL. The scraper uses the <code>inurl:</code> operator, even for multiple words (e.g. <code>recipe site:allrecipes.com inurl:apple inurl:pie</code>). There\'s also a <code>allinurl:</code> operator available, but it\'s problematic when combined with other search filters, so the scraper avoids using it. If you need to use the <code>allinurl:</code> operator specifically, you can include it in your custom queries from the <code>queries</code> field.",\n      "editor": "stringList",\n      "patternValue": "^[^\\\\s](.+[^\\\\s])*$",\n      "maxItems": 32,\n      "default": []\n    },\n    "quickDateRange": {\n      "title": "Quick date range",\n      "type": "string",\n      "description": "Filters results from a specific date range. d[number] specifies the number of past days (e.g. the past 10 days can be written as d10). The same applies to weeks, months, and years: w[number], m[number], y[number]. Example for the past year: \'1y\' or even \'y\'. The value is passed to Google Search using the <code>tbs</code> URL query parameter, prefixed with <code>qdr:</code>. You should avoid combining this filter with the <code>beforeDate</code> and <code>afterDate</code> filters to prevent conflicts.",\n      "editor": "textfield",\n      "pattern": "^[dwmy]\\\\d*$"\n    },\n    "beforeDate": {\n      "title": "Before date",\n      "type": "string",\n      "description": "Filters results from before the specified date. Either absolute date (e.g. `2024-05-03`) or relative date from now into the past (e.g. `8 days`, `3 months`). JSON input also supports adding time in both absolute (ISO standard, e.g. `2024-05-03T20:00:00`) and relative (e.g. `3 hours`) formats. Absolute time is always interpreted in the UTC timezone, not your local timezone - please convert accordingly. Supported relative date & time units: `minutes`, `hours`, `days`, `weeks`, `months`, `years`. You should avoid combining this filter with the `quickDateRange` filter to prevent conflicts.",\n      "editor": "datepicker",\n      "dateType": "absoluteOrRelative",\n      "pattern": "^(\\\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\\\d|3[01])(T[0-2]\\\\d:[0-5]\\\\d(:[0-5]\\\\d)?(\\\\.\\\\d+)?Z?)?$|^(\\\\d+)\\\\s*(minute|hour|day|week|month|year)s?$"\n    },\n    "afterDate": {\n      "title": "After date",\n      "type": "string",\n      "description": "Filters results from after the specified date. Either absolute date (e.g. `2024-05-03`) or relative date from now into the past (e.g. `8 days`, `3 months`). JSON input also supports adding time in both absolute (ISO standard, e.g. `2024-05-03T20:00:00`) and relative (e.g. `3 hours`) formats. Absolute time is always interpreted in the UTC timezone, not your local timezone - please convert accordingly. Supported relative date & time units: `minutes`, `hours`, `days`, `weeks`, `months`, `years`. You should avoid combining this filter with the `quickDateRange` filter to prevent conflicts.",\n      "editor": "datepicker",\n      "dateType": "absoluteOrRelative",\n      "pattern": "^(\\\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\\\d|3[01])(T[0-2]\\\\d:[0-5]\\\\d(:[0-5]\\\\d)?(\\\\.\\\\d+)?Z?)?$|^(\\\\d+)\\\\s*(minute|hour|day|week|month|year)s?$"\n    },\n    "fileTypes": {\n      "title": "File types",\n      "description": "Filters results of specific file types using the <code>filetype:</code> operator, such as <code>filetype:pdf</code>. You can select multiple file types as well. They will be combined with the <code>OR</code> operator, for example: <code>filetype:doc OR filetype:txt</code>. If you need to use a file type that is not in the list (such as a source code file type), you can include it in your custom queries from the <code>queries</code> field, using the <code>filetype:</code> operator.",\n      "type": "array",\n      "editor": "select",\n      "maxItems": 10,\n      "items": {\n        "type": "string",\n        "enum": [\n          "pdf",\n          "csv",\n          "epub",\n          "ps",\n          "htm",\n          "html",\n          "xls",\n          "xlsx",\n          "ppt",\n          "pptx",\n          "doc",\n          "docx",\n          "odp",\n          "ods",\n          "odt",\n          "rtf",\n          "svg",\n          "tex",\n          "txt",\n          "wml",\n          "wap",\n          "xml",\n          "xps",\n          "md",\n          "readme",\n          "log",\n          "yml",\n          "yaml",\n          "toml",\n          "ipynb",\n          "sas",\n          "sql",\n          "rdf",\n          "avif",\n          "avi",\n          "mkv",\n          "mov",\n          "flv",\n          "asf",\n          "ogv"\n        ],\n        "enumTitles": [\n          "Adobe Portable Document Format (pdf)",\n          "Comma-Separated Values (csv)",\n          "Electronic Publication (epub)",\n          "Adobe PostScript (ps)",\n          "HTML (htm)",\n          "HTML (html)",\n          "Microsoft Excel (xls)",\n          "Microsoft Excel (xlsx)",\n          "Microsoft PowerPoint (ppt)",\n          "Microsoft PowerPoint (pptx)",\n          "Microsoft Word (doc)",\n          "Microsoft Word (docx)",\n          "OpenOffice presentation (odp)",\n          "OpenOffice spreadsheet (ods)",\n          "OpenOffice text (odt)",\n          "Rich Text Format (rtf)",\n          "Scalable Vector Graphics (svg)",\n          "TeX/LaTeX (tex)",\n          "Text (txt)",\n          "Wireless Markup Language (wml)",\n          "Wireless Markup Language (wap)",\n          "XML (xml)",\n          "XML Paper Specification (xps)",\n          "Markdown (md)",\n          "Readme (readme)",\n          "Log file (log)",\n          "YAML (yml)",\n          "YAML (yaml)",\n          "TOML (toml)",\n          "Jupyter Notebook (ipynb)",\n          "SAS (sas)",\n          "SQL (sql)",\n          "Resource Description Framework (rdf)",\n          "AV1 Image File Format (avif)",\n          "Audio Video Interleave (avi)",\n          "Matroska Multimedia Container (mkv)",\n          "QuickTime Movie (mov)",\n          "Flash Video (flv)",\n          "Advanced Systems Format (asf)",\n          "Ogg Video (ogv)"\n        ]\n      }\n    },\n    "mobileResults": {\n      "title": "Mobile results",\n      "type": "boolean",\n      "description": "If checked the scraper will return results for mobile version of Google search. Otherwise desktop results are returned.",\n      "default": false,\n      "sectionCaption": "Additional settings"\n    },\n    "includeUnfilteredResults": {\n      "title": "Unfiltered results",\n      "type": "boolean",\n      "description": "If checked the lower quality results that Google normally filters out will be included.",\n      "default": false\n    },\n    "saveHtml": {\n      "title": "Save HTML to dataset",\n      "type": "boolean",\n      "description": "If checked the HTML of the Google Search results pages will be stored to the default dataset, under the <code>html</code> property. This is useful if you need to process the HTML, but it makes the dataset large.",\n      "default": false\n    },\n    "saveHtmlToKeyValueStore": {\n      "title": "Save HTML to key-value store",\n      "type": "boolean",\n      "description": "If checked the HTML of the Google Search results pages will be stored to the default key-value store and links to the files stored to the dataset under the <code>htmlSnapshotUrl</code> property. This is useful for debugging since you can easily view the pages in the browser. However, the use of this feature may slow down the Actor.",\n      "default": true\n    },\n    "includeIcons": {\n      "title": "Include icon image data (base64)",\n      "type": "boolean",\n      "description": "If checked all of the results (organicResults, paidResults, suggestedResults) will contain Base64-encoded icon image data if found.",\n      "default": false\n    }\n  },\n  "required": [\n    "queries"\n  ]\n}',
		readme:
			'## 🔎 What is a Google scraper?\n\nOur free SERP scraper crawls Google Search Results Pages (SERPs) and extracts data from those web pages in structured formats such as JSON, XML, CSV, or Excel. To extract images, visit our [Google Images Scraper](https://apify.com/hooli/google-images-scraper). With this SERP Scraper API, you will be able to **extract the following Google data from each Google page**:\n\n<table>\n<tr>\n<td> 🌱 Organic results </td>\n<td> 🛍 Paid results </td>\n</tr>\n<tr>\n<td> 🤖 AI Overviews </td>\n<td> 📢 Product ads </td>\n</tr>\n<tr>\n<td> ❓ Related queries </td>\n<td> 🙋‍♀️ People Also Ask </td>\n</tr>\n<tr>\n<td> 🏷 Prices </td>\n<td> ⭐️ Review rating and review count  </td>\n</tr>\n<tr>\n<td> 🪴 Suggested results </td>\n<td> 🔍 Additional custom attributes  </td>\n</tr>\n</table>\n\n## 💯 How many results can you scrape with Google Search Scraper?\n\nGoogle Search Scraper can return **up to 300 results for one keyword**. This is due to the limitations of Google itself: although it shows as if it has millions of results for a given search query, Google will always display a maximum of three pages. With a maximum 100 results shown per page, this makes up to 300 results in total.\n\nIf your use case doesn\'t require otherwise, we strongly recommend you to keep the setting or  **`Results per Google page`** to the max 100, so that you get 100 results per 1 page instead of crawling 10 pages, each with 10 results. The 10 by 10 is also possible but since you’re paying for request, it will be ten times more pricey than it could’ve been).\n\nWhile we regularly run Actor tests to keep the benchmarks in check, the results may also fluctuate without our knowing. The best way to know for sure for your particular use case is to do a test run yourself.\n\n## 💸 How much will scraping Google Search cost you?\n\nGoogle Search Scraper uses the Pay-per-result pricing model, so your costs can be easily calculated: it will cost you $3.50 to scrape 1,000 search results, so $0.0035 per item. With Apify’s [Free plan](https://apify.com/pricing), you get $5 in usage credits every month, allowing you to **scrape over 1,400 results from Google for free**.\n\nIf you need to scrape data regularly, we recommend getting an Apify subscription. The [$49/month Starter plan](https://apify.com/pricing) can get you **over 14,000 Google results each month**.\n\n## ⬇️ Google Search data input\n\nThe scraper gives you really good control over what kind of Google Search results you\'ll get. You can specify the following settings:\n\n- Query phrases or raw Google search URLs 🔍\n- Country/search domain 🗺\n- Language of search 🇬🇧\n- Exact geolocation 📍\n- Number of results per page 🔟\n- Mobile or desktop version results 📱\n\nFor a complete description of all settings, see the [Input tab](https://apify.com/apify/google-search-scraper/input-schema).\n\n### How to scrape Google Search results by URL or keyword\n\nThere are two ways you can scrape Google search pages: either by URL or by search term.\n\n1. Scraping **by URL** will get you data from Google Search results page. You\'ll get Google data from a copy-pasted Google URL with any Google country domain (e.g. `google.co.uk`). You can add as many URLs as you want.\n2. Scraping **by search term** will also get you data from Google Search results page. You can also add as many search terms as you want.\n\n#### Example input for scraping Google Search search term\n\nIt is also easy to get Google search data by search term. Just enter the search term and a number of Google pages to scrape. With this option, you also can:\n\n- scrape by multiple keywords in parallel by adding more search terms and separating them by a new line\n- indicate how many results you want to see per each Google page (10-100)\n- indicate the country of search (domain), language, and UULE location parameter\n\n<a href="https://console.apify.com/actors/nFJndFXA5zjCTuudP/input">\n    <img width="75%" src="https://i.imgur.com/mIYv0eZ.png" />\n</a>\n\nHere\'s its equivalent in JSON:\n\n```json\n{\n  "countryCode": "us",\n  "customDataFunction": "async ({ input, $, request, response, html }) => {\\\\\\\\n  return {\\\\\\\\n    pageTitle: $(\'title\').text(),\\\\\\\\n  };\\\\\\\\n};",\n  "includeUnfilteredResults": false,\n  "languageCode": "en",\n  "maxPagesPerQuery": 2,\n  "mobileResults": false,\n  "queries": "hotels in Seattle \\\\n hotels in New York",\n  "resultsPerPage": 10,\n  "saveHtml": false,\n  "saveHtmlToKeyValueStore": false,\n  "maxConcurrency": 10\n}\n\n```\n\n#### Scrape Google Search results by URL\n\nTo input URLs instead, simply replace `queries` with full URLs:\n\n```json\n"queries": "<https://www.google.com/search?q=hotels+in+Seattle> \\\\n <https://www.google.com/search?q=hotels+in+New+York>",\n\n```\n\n## ⬆️ Google Search data output\n\nThe scraper stores its result in the default [dataset](https://apify.com/docs/storage#dataset) associated with the scraper run, from which you can export it to various formats, such as JSON, XML, CSV, or Excel.\n\n### Output example (by search term)\n\nFor each Google Search results page, the dataset will contain a single record, which looks as follows. Note that the output preview will be organized in table and tabs for viewing convenience:\n\n[![Google SERP API Scraper](https://github.com/natashalekh/natashalekh.github.io/blob/main/Google%20SERP%20API%20Scraper.gif?raw=true)](https://console.apify.com/actors/nFJndFXA5zjCTuudP/input)\n\n\nAnd here’s the equivalent of the same scraped data but in JSON. Bear in mind that some fields have example values: <br>\n\n```json\n{\n    "searchQuery": {\n        "term": "hotels in seattle",\n        "url": "<http://www.google.com/search?num=100&q=hotels%20in%20seattle>",\n        "device": "DESKTOP",\n        "page": 1,\n        "type": "SEARCH",\n        "domain": "google.com",\n        "countryCode": "US",\n        "languageCode": null,\n        "locationUule": null,\n        "resultsPerPage": "100"\n    },\n    "url": "<http://www.google.com/search?num=100&q=hotels%20in%20seattle>",\n    "hasNextPage": true,\n    "serpProviderCode": "N",\n    "resultsTotal": 54000000,\n    "relatedQueries": [\n        {\n            "title": "Feedback",\n            "url": "<https://www.google.com/#>"\n        },\n        {\n            "title": "Hyatt Regency Seattle",\n            "url": "<https://www.google.com/search?num=100&q=Hyatt+Regency+Seattle&stick=H4sIAAAAAAAAAOOQUeLSz9U3MDHOSTEwNRJNzsnMTSxJVSjISU1JT1XIyC9JzSmOEoTQCpl5CsWpiSUlOamnGJG0QTlGVWbpBkVQTm5ZXnFG8ilGHv10fcPKXAujksKUNKhceVp6RVI5lGOcYZicnnSKkRuksCSl2CwlJ_cXo6gz1CEByA5pYGFcxCrqUQl0gkJQanpqXnKlQjDEQbfYJBlKnl2b9VUhNGan8tzMrdvyU0SSttVPXDDVAAAvau1f5QAAAA&sa=X&ved=2ahUKEwiRxJ_e2J__AhUVZTABHRosAFcQs9oBKAB6BAgXEAI>"\n        }\n        // ... and many more\n    ],\n    "paidResults": [\n        {\n            "title": "Hotels in Seattle, WA - Lowest Price Guarantee.",\n            "url": "<https://www.google.com/aclk?sa=l&ai=DChcSEwiMzqXe2J__AhW_gVoFHbh6BGYYABABGgJ2dQ&sig=AOD64_3PbWI_s3u1fE0Dh4Dobi56jDDCfw&q&adurl>",\n            "displayedUrl": "",\n            "description": "",\n            "emphasizedKeywords": [],\n            "siteLinks": [\n                {\n                    "title": "",\n                    "url": "<https://www.google.com/aclk?sa=l&ai=DChcSEwiMzqXe2J__AhW_gVoFHbh6BGYYABAHGgJ2dQ&sig=AOD64_3x8pu1mywduFwZgi9cwut7L9Nrvg&q=&ved=2ahUKEwiRxJ_e2J__AhUVZTABHRosAFcQh78CegQIDhAB&adurl=>",\n                    "description": ""\n                },\n                {\n                    "title": "Hotels at Great Prices",\n                    "url": "<https://www.google.com/aclk?sa=l&ai=DChcSEwiMzqXe2J__AhW_gVoFHbh6BGYYABADGgJ2dQ&sig=AOD64_1Bl0Ju75dgDPwLJAb53UYrV1xyMQ&q&adurl>",\n                    "description": ""\n                }\n                // ... and many more\n            ],\n            "type": "paid",\n            "adPosition": 1\n        },\n        {\n            "title": "Cheap Hotels in Seattle - Best Deals in Seattle",\n            "url": "<https://www.google.com/aclk?sa=l&ai=DChcSEwiMzqXe2J__AhW_gVoFHbh6BGYYABAAGgJ2dQ&sig=AOD64_27qRewPYeehK82DHa3ck7RlyilRg&q&adurl>",\n            "displayedUrl": "",\n            "description": "",\n            "emphasizedKeywords": [],\n            "siteLinks": [\n                {\n                    "title": "",\n                    "url": "<https://www.google.com/aclk?sa=l&ai=DChcSEwiMzqXe2J__AhW_gVoFHbh6BGYYABACGgJ2dQ&sig=AOD64_0sufwpcy9IZTR-ZX82HaFX1Xqc-w&q=&ved=2ahUKEwiRxJ_e2J__AhUVZTABHRosAFcQh78CegQIBxAB&adurl=>",\n                    "description": ""\n                }\n            ],\n            "type": "paid",\n            "adPosition": 2\n        }\n    ],\n    "paidProducts": [],\n    "organicResults": [\n        {\n            "title": "The Best Hotels in Seattle, WA",\n            "url": "<https://www.hotels.com/de1481165/hotels-seattle-washington/>",\n            "displayedUrl": "<https://www.hotels.com> › ... › Hotels in Washington",\n            "description": "The Inn at Virginia Mason · The Belltown Inn · Hyatt Regency Seattle · Mediterranean Inn · Hotel Max · Crowne Plaza Seattle - Downtown, an IHG Hotel · Mayflower Park ...",\n            "emphasizedKeywords": [\n                "Seattle",\n                "Hotel",\n                "Seattle",\n                "Hotel"\n            ],\n            "siteLinks": [],\n            "productInfo": {},\n            "type": "organic",\n            "position": 1\n        },\n        {\n            "title": "THE 10 BEST Hotels in Seattle, WA 2023 (from $87)",\n            "url": "<https://www.tripadvisor.com/Hotels-g60878-Seattle_Washington-Hotels.html>",\n            "displayedUrl": "<https://www.tripadvisor.com> › ... › Seattle Hotels",\n            "description": "Popular hotels in Seattle right now · 1. Embassy Suites by Hilton Seattle Downtown Pioneer Square · 1,293 reviews · 2. Hyatt Regency Seattle · 1,917 reviews · 3.",\n            "emphasizedKeywords": [\n                "hotels in Seattle"\n            ],\n            "siteLinks": [],\n            "productInfo": {},\n            "type": "organic",\n            "position": 2\n        }\n        // ... and many more\n    ],\n    "peopleAlsoAsk": [\n        {\n            "question": "Is it better to stay in downtown Seattle or?",\n            "answer": "For most visitors, the best area to stay is downtown Seattle (and near Pike Place Market). Downtown is where most of Seattle\'s best hotels, top restaurants, attractions, and shopping are located – all within an area dense, compact, and walkable.",\n            "url": "<https://santorinidave.com/best-places-seattle#:~:text=For%20most%20visitors%2C%20the%20best,dense%2C%20compact%2C%20and%20walkable.">,\n            "title": "WHERE TO STAY in SEATTLE - Best Areas & Neighborhoods",\n            "date": "May 9, 2023"\n        },\n        {\n            "question": "Is it easy to get around Seattle without a car?",\n            "answer": "You can easily get around Seattle without a car. Places like Pike Place Market, the Seattle Center, the waterfront, and a lot of neighborhoods are walkable.",\n            "url": "<https://travellemming.com/getting-around-seattle/#:~:text=You%20can%20easily%20get%20around,lot%20of%20neighborhoods%20are%20walkable.">,\n            "title": "Getting Around Seattle (A Local\'s Transportation Guide)",\n            "date": "Jan 13, 2023"\n        },\n        {\n            "question": "Where not to stay in downtown Seattle?",\n            "answer": "Avoid downtown Seattle\'s 3rd Avenue, particularly between Pike and Pine, and James and Yesler. Pioneer Square, SoDo, the International District, First Hill, and certain parts of Belltown can be a bit sketchy. That said, visitors should exercise caution when exploring at night.",\n            "url": "<https://travellemming.com/is-seattle-safe/#:~:text=Avoid%20downtown%20Seattle\'s%203rd%20Avenue,caution%20when%20exploring%20at%20night.">,\n            "title": "Is Seattle Safe in 2023? (Honest Info From a Local) - Travel Lemming",\n            "date": "Feb 16, 2023"\n        },\n        {\n            "question": "Should I stay in West Seattle?",\n            "answer": "West Seattle Don\'t get me wrong: West Seattle is a great place. In fact, I highly recommend taking a half-day or day to visit the area if you have the time during your Seattle trip. Especially along Alki Beach, you can enjoy sweeping views of Puget Sound and the Seattle skyline, plus enjoy local food and drink.",\n            "url": "<https://www.valisemag.com/where-to-stay-seattle/#:~:text=5.-,West%20Seattle,enjoy%20local%20food%20and%20drink.">,\n            "title": "The 10 Best Areas to Stay in Seattle (& Where Not To!) - Valerie & Valise",\n            "date": "Sep 29, 2020"\n        }\n    ],\n    "customData": {\n        "pageTitle": "hotels in seattle - Google Search"\n    }\n}\n\n```\n\n<br> You can **download the results directly from the platform using a button** or from the [Get dataset items](https://www.apify.com/docs/api/v2#/reference/datasets/item-collection/get-items) API endpoint:\n\n```json\n<https://api.apify.com/v2/datasets/[DATASET_ID]/items?format=[FORMAT]>\n\n```\n\nwhere `[DATASET_ID]` is the ID of the dataset and `[FORMAT]`can be `csv`, `html`, `xlsx`, `xml`, `rss` or `json`.\n\n## 🧑‍🏫 How do I use Google SERP Scraper?\n\nTo understand how to set up and run the Google SERP Scraper (or Google SERP API), check out our step-by-step guide on [how to scrape Google Search](https://blog.apify.com/unofficial-google-search-api-from-apify-22a20537a951) with screenshots and examples or [watch a short video tutorial](https://www.youtube.com/watch?v=wjLskDlPfvo)  ▷ on YouTube.\n\n[google scraping](https://www.youtube.com/watch?v=wjLskDlPfvo)\n\n## ❓FAQ\n\n### 📚 Resources on how to use Google SERP API to scrape Google\n\n1. [Is web scraping legal?](https://blog.apify.com/is-web-scraping-legal/) - blogpost on ethical scraping.\n2. [Platform pricing page](https://apify.com/pricing/actors) with pricing specifications.  \n3. [Video guide ▷](https://www.youtube.com/watch?v=-wyz2iscZ30) on how to count the usage of Google Search API.\n4. [Step-by-step guide](https://blog.apify.com/unofficial-google-search-api-from-apify-22a20537a951/) on how to use Google SERP scraper. \n5. [Video tutorial ▷](https://www.youtube.com/watch?v=Zvr4awK92oo) on how to use Google Images scraper.\n6. [Video tutorial ▷](https://www.youtube.com/watch?v=wjLskDlPfvo) on how to use Google SERP scraper.\n7. [Input tab](https://apify.com/apify/google-search-scraper/input-schema) with all the technical parameters of this scraper.\n8. A list of other [Google-related scrapers.](https://apify.com/store?search=google)\n\n### Want to scrape images from Google?\n\nIf you\'re looking to scrape specific [data from public Google services](https://apify.com/store/categories?search=google), you\'re in luck! Whether it\'s for extracting location details, reviews, trends, or even job listings, there’s a dedicated scraper for each case. Browse through these tailored solutions to find the one that fits your needs:\n\n<table>\n<tr>\n<td>📍 <a href="https://apify.com/compass/google-maps-extractor">Google Maps Extractor</a></td>\n<td>👁 <a href="https://apify.com/alexey/google-lens">Google Lens Scraper</a></td>\n</tr>\n<tr>\n<td>🎓 <a href="https://apify.com/marco.gullo/google-scholar-scraper">Google Scholar Scraper</a></td>\n<td>🛍 <a href="https://apify.com/emastra/google-shopping-scraper">Google Shopping Scraper</a></td>\n</tr>\n<tr>\n<td>📈 <a href="https://apify.com/emastra/google-trends-scraper">Google Trends Scraper</a></td>\n<td>⭐️ <a href="https://apify.com/compass/google-maps-reviews-scraper">Google Reviews Scraper</a></td>\n</tr>\n<tr>\n<td>🖼 <a href="https://apify.com/hooli/google-images-scraper">Google Images Scraper</a></td>\n<td>🗞 <a href="https://apify.com/lhotanova/google-news-scraper">Google News Scraper</a></td>\n</tr>\n<tr>\n<td>🧾 <a href="https://apify.com/silva95gustavo/google-ads-scraper">Google News Scraper</a></td>\n<td>📇 <a href="https://apify.com/epctex/google-jobs-scraper">Google Jobs Scraper</a></td>\n</tr>\n</table>\n\n#### How do I scrape millions of results from Google?\n\nPlease note that, although Google always shows that it has found millions of results, **Google will never display more than a few hundred results for a single search query** 🤥 If your goal is to get as many results as possible, try creating many similar queries and combine different parameters and locations.\n\n#### How do I scrape Google ads?\n\nDespite the fact that scraping Google is the best shot we\'ve got at seeing objective Google results, **displayed paid results are still heavily dependent on your location and browsing history**. It’s also up to Google to choose which ads to show to which user (hello, cookies 🍪). It might be underwhelming to see less results than you\'d expected. Most probably, Google\'s precise algorithm is the reason for it.\n\n#### Is it legal to scrape Google search results?\n\nWeb scraping is legal if you are extracting publicly available data, but you should respect boundaries such as personal data and intellectual property regulations.\nRule of thumb is: you should only scrape personal data if you have a legitimate reason to do so, factoring in Google\'s [Terms of Use](https://policies.google.com/terms?hl=en) as well. If you\'re unsure whether your reason is legitimate, consult your lawyers. We also recommend that you read our blog post on the subject: [is web scraping legal?](https://blog.apify.com/is-web-scraping-legal/)\n\n\n#### How can I use data scraped from Google Search?\n\nGoogle SERP API has a lot to offer in terms of how extracted Google data can be applied:\n\n🔸 **Use it for search engine optimization (SEO)** and monitor how your website performs on Google for certain queries over time.\n\n🔹 **Monitor how frequently a search term has been used** on Google, and how it compares with total search volume.\n\n🔸 **Analyze display ads** for a given set of keywords.\n\n🔹 **Monitor your competition** in both organic and paid results.\n\n🔸 **Build a URL list for certain keywords**. This is useful if, for example, you need good relevant starting points when scraping web pages containing specific phrases.\n\n🔹 **Analyze Google algorithm** and identify its main trends\n\n#### Can I integrate Google Scraper with other apps?\n\nLast but not least, this Google SERP API can be connected with almost any cloud service or web app thanks to [integrations on the Apify platform](https://apify.com/integrations). You can integrate with Make, Zapier, Slack, Airbyte, GitHub, Google Sheets, Google Drive, [and more](https://docs.apify.com/integrations). Or you can use [webhooks](https://docs.apify.com/integrations/webhooks) to carry out an action whenever an event occurs, e.g. get a notification whenever Google Search Results Scraper successfully finishes a run.\n\n#### Can I use Google Scraper with the API?\n\nThe Apify API gives you programmatic access to the Apify platform. The API is organized around RESTful HTTP endpoints that enable you to manage, schedule, and run Apify Actors. The API also lets you access any datasets, monitor actor performance, fetch results, create and update versions, and more.\n\nTo access the API using Node.js, use the `apify-client` NPM package. To access the API using Python, use the `apify-client` PyPi package.\n\nCheck out the [Apify API reference docs](https://docs.apify.com/api/v2) for full details or click on the [API tab](https://apify.com/apify/google-search-scraper/api/javascript) for code examples. You can also follow [this video guide](ttps://www.youtube.com/watch?v=ViYYDHSBAKM).\n\n#### How to get one search result per row\n\nSimply choose the Export view for `Organic results` and/or `Paid results`, it automatically spreads each result into a separate row. For API access, you can add `&view=paid_results` or `&view=organic_results` to the URL and with the API client, you can do the same using the `view` field.\n\nAn organic result is represented using the following format:\n\n```json\n{\n  "searchQuery": {\n    "term": "laptop",\n    "device": "DESKTOP",\n    "page": 1,\n    "type": "SEARCH",\n    "domain": "google.com",\n    "countryCode": "US",\n    "languageCode": "en",\n    "locationUule": null,\n    "resultsPerPage": 10\n  },\n  "type": "organic",\n  "position": 1,\n  "title": "Laptops & Notebook Computers - Best Buy",\n  "url": "<https://www.bestbuy.com/site/computers-pcs/laptop-computers/abcat0502000.c?id=abcat0502000>",\n  "displayedUrl": "<https://www.bestbuy.com> › Computers & Tablets",\n  "description": "Shop Best Buy for laptops. Work & play from anywhere with a notebook computer. We can help you find the best laptop for your specific needs in store and online.",\n  "emphasizedKeywords": "laptops | laptop",\n  "productInfo": {}\n}\n\n```\n\nA paid result has an `adPosition` field instead of `position` and `"type": "paid"`. **Paid result position is calculated separately from the organic results**.\n\nWhen using a tabular format such as `csv` or `xls`, you\'ll get a table where each row contains just one organic result. For more details about exporting and formatting the dataset records, please see the documentation for the [Get dataset items](https://apify.com/docs/api/v2#/reference/datasets/item-collection/get-items) API endpoint.\n\n#### Not your cup of tea? Build your own scraper.\n\nThis Google SERP API doesn’t exactly do what you need? You can always build your own! We have various [scraper templates](https://apify.com/templates) in Python, JavaScript, and TypeScript to get you started. Alternatively, you can write it from scratch using our [open-source library Crawlee](https://crawlee.dev/). You can keep the scraper to yourself or make it public by adding it to Apify Store (and [find users](https://apify.com/partners/actor-developers) for it).\n\n\n#### Your feedback\n\nIf you are not sure that the results are complete and of good quality, each run stores the full HTML page to the default Key-Value Store. You can view the KVS by clicking on it and comparing the results. \n\nWe’re always working on improving the performance of our Actors and monitoring the quality but we are happy for any reports. So if you’ve got any technical feedback for this Google SERP API or simply found a bug, please create an issue on the Actor’s [Issues tab](https://apify.com/apify/google-search-scraper/issues/open).\n',
		changelog:
			"### 2024-08-22 (0.0.128)\n\n*Fixes*\n- Renable exluding results based on `:site` filter parameter as there were several reports when Google didn't respect this filter.\n\n### 2024-06-14 (0.0.122)\n\n*Fixes*\n- Disable excluding results based on `:site` filter parameter. The actor was checking whether all results from Google match the `site:` filter and excluded those that didn't match. This feature was buggy so we decided to disable it.\n\n### 2024-06-03 (0.0.121)\n\n*Fixes*\n- Don't distinguish `http` vs `https` when filtering results with the `:site` clause.\n\n*Features*\n- Add `includeIcons` to input to extract result icons in base64 format. The image data is relatively large so we decided not to include it by default.\n\n### 2024-04-23 (0.0.119)\n\n*Fixes*\n- Fixed extracting `personalInfo` from linkedin sites\n\n### 2024-04-08 (0.0.118)\n\n*Fixes*\n- Fixed `personalInfo` extraction in mobile results\n- Fixed `relatedQueries` extraction in mobile results\n- Store the results suggested by Google to `suggestedResults` instead of `organicResults`\n\n### 2024-02-12 (0.0.113)\n\n*Improvements*:\n- Actor continues scraping the next page if number of organic and paid results is greater than 80% of `resultsPerPage`.\n\n### 2023-12-23 (0.0.109)\n*Fixes*\n- Improve handling of potentially non-matching `site:` filters. We check for a correct format and track any inconsistencies if there would be any. Users often use the filter in wrong format (e.g. `-site:` or multiple `site:` which doesn't work)\n\n### 2023-12-23 (0.0.108)\n*Fixes*\n- Fix problem that sometimes not all `relatedQueries` were extracted\n\n### 2023-10-30 (0.0.106)\n*Fixes*:\n- Fixed extraction of `companyName` field\n\n### 2023-09-25 (0.0.103)\n*Fixes*:\n- Updated css selector for result's description\n\n### 2023-08-21 (0.0.100)\n\n*Fixes*:\n- Fixed issue with pagination, where some pages Google returned didn't have the next page (depending on IP used). The actor will now visit every page it ever saw in pagination which fixes this issue\n\n### 2023-08-11 (0.0.99)\n\n*Fixes*:\n- Updated mobile selectors\n\n### 2023-07-08\n*Fixes*:\n- Retry requests where some result domains don't correctly match the `site:` restriction. This happened very rarely and we are still investigating why Google would provide such results.\n\n### 2023-06-26 (0.0.84)\n*Fixes*:\n- Correctly parse new result type with one full result-like site link\n\n### 2023-05-31 (0.0.82)\n*Features*\n- Added output schema formats to download organic and paid results separately with one result per row format. For API access, add `&view=paid_results` or `&view=organic_results` to the URL.\n- Added `type`: `organic` or `paid` and `position` or `adPosition` to all organic and paid results for consistency.\n\n*Changes*\n- Deprecated input field `csvFriendlyOutput`, please migrate to using the new output schema formats. We will keep supporting `csvFriendlyOutput` for some time.\n\n### 2023-05-29 (0.0.81)\n*Fixes*\n- Replaces `\\t` characters in queries with spaces. Previously, they were briefly ignored which broke some queries.\n\n### 2023-04-06\n*Fixes*\n- Fixed personal info for LinkedIn results\n\n### 2023-03-7\n\n*Changes*\n- Updated to version 3\n\n*Fixes*\n- Updated ads URLs selectors for desktop and mobile\n\n### 2023-02-15\n\n*Fixes*\n- Updated `relatedQueries` selectors to work with the new layout\n\n### 2023-01-20\n\n*Fixes*\n- Log proper error is `customDataFunction` throws an error\n- Log an error if a request fails all retries\n\n*Changes*\n- If `customDataFunction` throws an error, normal output is still returned, instead of crashing\n\n### 2023-01-19\n\n*Fixes* (new layout)\n- Fixed organic desktop results\n- Fixed organic mobile missing title and displayUrl\n- Fixed organic mobile missing top results\n- Deduplicate results\n\n### 2022-11-17\n\n- Fixed mobile extractor, paidResults, siteLinks, and description\n\n### 2022-11-16\n\n- Fixed mobile extractor paidResults, paidProducts, organicResults\n\n### 2022-08-24\n\n- Fixed organic results sometimes missing top result and twitter based results\n\n### 2022-05-03\n\n- Added `personalInfo` to output containing `name`, `location`, `jobTitle`, `companyName`, `cleanDescription`. These are available mainly for LinkedIn results.\n\n### 2022-01-31\n\n- Implemented `csvFriendlyOutput` option\n- Handled missing `www.` on domains\n\n### 2022-01-21\n\n- Fixed organic results for desktop (new layout)\n\n### 2021-02-25\n\n- Hotfixed `relatedQueries` and `peopleAlsoAsk` in the new layout\n\n### 2021-01-19\n\n- Fixed extractor to work on new Google layout\n- Added parsing emphasized text\n\n### 2020-11-19\n\n- Fixed new layout for mobile paid ads\n\n### 2020-10-01\n\n- Hotfix after Google changed the page layout for desktop\n- Fixed main selector for paid results\n- Fixed `description` for paid results\n- Fixed `description`, `url` and `siteLinks` for organic results\n\n### 2020-07-15 (beta)\n\n- Fixed site links being present in a title of paid results\n- Better explanation about max limit of results\n- Added [Apify](https://sdk.apify.com/docs/api/apify) to `customDataFunction`\n- Added `includeUnfilteredResults` option\n- Parsing of product info - rating, number of reviews and price\n- Fixed `unmatched pseudo-class :first` error on desktop paid products\n",
		gitCommitId: 'c83dd39baf885c854ae508ac5791e6295e1db5f5',
		gitBranchName: 'master',
		actorDefinition: {
			actorSpecification: 1,
			name: 'google-search-scraper',
			title: 'Google Search Scraper',
			dockerContextDir: '../../..',
			changelog:
				"### 2024-08-22 (0.0.128)\n\n*Fixes*\n- Renable exluding results based on `:site` filter parameter as there were several reports when Google didn't respect this filter.\n\n### 2024-06-14 (0.0.122)\n\n*Fixes*\n- Disable excluding results based on `:site` filter parameter. The actor was checking whether all results from Google match the `site:` filter and excluded those that didn't match. This feature was buggy so we decided to disable it.\n\n### 2024-06-03 (0.0.121)\n\n*Fixes*\n- Don't distinguish `http` vs `https` when filtering results with the `:site` clause.\n\n*Features*\n- Add `includeIcons` to input to extract result icons in base64 format. The image data is relatively large so we decided not to include it by default.\n\n### 2024-04-23 (0.0.119)\n\n*Fixes*\n- Fixed extracting `personalInfo` from linkedin sites\n\n### 2024-04-08 (0.0.118)\n\n*Fixes*\n- Fixed `personalInfo` extraction in mobile results\n- Fixed `relatedQueries` extraction in mobile results\n- Store the results suggested by Google to `suggestedResults` instead of `organicResults`\n\n### 2024-02-12 (0.0.113)\n\n*Improvements*:\n- Actor continues scraping the next page if number of organic and paid results is greater than 80% of `resultsPerPage`.\n\n### 2023-12-23 (0.0.109)\n*Fixes*\n- Improve handling of potentially non-matching `site:` filters. We check for a correct format and track any inconsistencies if there would be any. Users often use the filter in wrong format (e.g. `-site:` or multiple `site:` which doesn't work)\n\n### 2023-12-23 (0.0.108)\n*Fixes*\n- Fix problem that sometimes not all `relatedQueries` were extracted\n\n### 2023-10-30 (0.0.106)\n*Fixes*:\n- Fixed extraction of `companyName` field\n\n### 2023-09-25 (0.0.103)\n*Fixes*:\n- Updated css selector for result's description\n\n### 2023-08-21 (0.0.100)\n\n*Fixes*:\n- Fixed issue with pagination, where some pages Google returned didn't have the next page (depending on IP used). The actor will now visit every page it ever saw in pagination which fixes this issue\n\n### 2023-08-11 (0.0.99)\n\n*Fixes*:\n- Updated mobile selectors\n\n### 2023-07-08\n*Fixes*:\n- Retry requests where some result domains don't correctly match the `site:` restriction. This happened very rarely and we are still investigating why Google would provide such results.\n\n### 2023-06-26 (0.0.84)\n*Fixes*:\n- Correctly parse new result type with one full result-like site link\n\n### 2023-05-31 (0.0.82)\n*Features*\n- Added output schema formats to download organic and paid results separately with one result per row format. For API access, add `&view=paid_results` or `&view=organic_results` to the URL.\n- Added `type`: `organic` or `paid` and `position` or `adPosition` to all organic and paid results for consistency.\n\n*Changes*\n- Deprecated input field `csvFriendlyOutput`, please migrate to using the new output schema formats. We will keep supporting `csvFriendlyOutput` for some time.\n\n### 2023-05-29 (0.0.81)\n*Fixes*\n- Replaces `\\t` characters in queries with spaces. Previously, they were briefly ignored which broke some queries.\n\n### 2023-04-06\n*Fixes*\n- Fixed personal info for LinkedIn results\n\n### 2023-03-7\n\n*Changes*\n- Updated to version 3\n\n*Fixes*\n- Updated ads URLs selectors for desktop and mobile\n\n### 2023-02-15\n\n*Fixes*\n- Updated `relatedQueries` selectors to work with the new layout\n\n### 2023-01-20\n\n*Fixes*\n- Log proper error is `customDataFunction` throws an error\n- Log an error if a request fails all retries\n\n*Changes*\n- If `customDataFunction` throws an error, normal output is still returned, instead of crashing\n\n### 2023-01-19\n\n*Fixes* (new layout)\n- Fixed organic desktop results\n- Fixed organic mobile missing title and displayUrl\n- Fixed organic mobile missing top results\n- Deduplicate results\n\n### 2022-11-17\n\n- Fixed mobile extractor, paidResults, siteLinks, and description\n\n### 2022-11-16\n\n- Fixed mobile extractor paidResults, paidProducts, organicResults\n\n### 2022-08-24\n\n- Fixed organic results sometimes missing top result and twitter based results\n\n### 2022-05-03\n\n- Added `personalInfo` to output containing `name`, `location`, `jobTitle`, `companyName`, `cleanDescription`. These are available mainly for LinkedIn results.\n\n### 2022-01-31\n\n- Implemented `csvFriendlyOutput` option\n- Handled missing `www.` on domains\n\n### 2022-01-21\n\n- Fixed organic results for desktop (new layout)\n\n### 2021-02-25\n\n- Hotfixed `relatedQueries` and `peopleAlsoAsk` in the new layout\n\n### 2021-01-19\n\n- Fixed extractor to work on new Google layout\n- Added parsing emphasized text\n\n### 2020-11-19\n\n- Fixed new layout for mobile paid ads\n\n### 2020-10-01\n\n- Hotfix after Google changed the page layout for desktop\n- Fixed main selector for paid results\n- Fixed `description` for paid results\n- Fixed `description`, `url` and `siteLinks` for organic results\n\n### 2020-07-15 (beta)\n\n- Fixed site links being present in a title of paid results\n- Better explanation about max limit of results\n- Added [Apify](https://sdk.apify.com/docs/api/apify) to `customDataFunction`\n- Added `includeUnfilteredResults` option\n- Parsing of product info - rating, number of reviews and price\n- Fixed `unmatched pseudo-class :first` error on desktop paid products\n",
			dockerfile: '../../../Dockerfile',
			description: 'Scrapes results from Google',
			version: '0.0',
			maxMemoryMbytes: 4096,
			minMemoryMbytes: 1024,
			storages: {
				dataset: {
					actorSpecification: 1,
					title: 'Google Search Scraper',
					description:
						'Too see all scraped properties, export the whole dataset or select All fields instead of Overview',
					views: {
						overview: {
							title: 'Overview',
							description: '',
							transformation: {
								fields: [
									'searchQuery',
									'resultsTotal',
									'relatedQueries',
									'aiOverview',
									'paidResults',
									'paidProducts',
									'organicResults',
									'peopleAlsoAsk',
								],
							},
							display: {
								component: 'table',
								properties: {
									'$searchQuery.term': {
										label: 'Search term',
										format: 'text',
									},
									$resultsTotal: {
										label: 'Google Internal Count',
										format: 'number',
									},
									relatedQueries: {
										label: 'Related queries',
										format: 'array',
									},
									aiOverview: {
										label: 'AI Overview',
										format: 'object',
									},
									paidResults: {
										label: 'Paid results',
										format: 'array',
									},
									paidProducts: {
										label: 'Paid products',
										format: 'array',
									},
									organicResults: {
										label: 'Organic results',
										format: 'array',
									},
									peopleAlsoAsk: {
										label: 'People also ask',
										format: 'array',
									},
								},
							},
						},
						organic_results: {
							title: 'Organic results',
							description: '',
							transformation: {
								fields: [
									'title',
									'url',
									'description',
									'displayedUrl',
									'emphasizedKeywords',
									'siteLinks',
									'date',
									'productInfo',
									'personalInfo',
									'organicResults',
								],
								unwind: ['organicResults'],
							},
							display: {
								component: 'table',
								properties: {
									title: {
										label: 'Title',
										format: 'text',
									},
									url: {
										label: 'URL',
										format: 'link',
									},
									description: {
										label: 'Description',
										format: 'text',
									},
									'$searchQuery.term': {
										label: 'Search term',
										format: 'text',
									},
									'$searchQuery.page': {
										label: 'Page',
										format: 'number',
									},
									displayedUrl: {
										label: 'Displayed url',
										format: 'link',
									},
									emphasizedKeywords: {
										label: 'Emphasized keywords',
										format: 'array',
									},
									siteLinks: {
										label: 'Site links',
										format: 'array',
									},
									date: {
										label: 'Date',
										format: 'date',
									},
									productInfo: {
										label: 'Product info',
										format: 'object',
									},
									personalInfo: {
										label: 'Personal info',
										format: 'object',
									},
								},
							},
						},
						paid_results: {
							title: 'Paid results (if any)',
							description: '',
							transformation: {
								fields: [
									'searchQuery',
									'resultsTotal',
									'title',
									'url',
									'description',
									'displayedUrl',
									'emphasizedKeywords',
									'siteLinks',
									'date',
									'productInfo',
									'personalInfo',
									'paidResults',
								],
								unwind: ['paidResults'],
							},
							display: {
								component: 'table',
								properties: {
									title: {
										label: 'Title',
										format: 'text',
									},
									url: {
										label: 'URL',
										format: 'link',
									},
									description: {
										label: 'Description',
										format: 'text',
									},
									'$searchQuery.term': {
										label: 'Search term',
										format: 'text',
									},
									'$searchQuery.page': {
										label: 'Page',
										format: 'number',
									},
									displayedUrl: {
										label: 'Displayed url',
										format: 'link',
									},
									emphasizedKeywords: {
										label: 'Emphasized keywords',
										format: 'array',
									},
									siteLinks: {
										label: 'Site links',
										format: 'array',
									},
									date: {
										label: 'Date',
										format: 'date',
									},
									productInfo: {
										label: 'Product info',
										format: 'object',
									},
									personalInfo: {
										label: 'Personal info',
										format: 'object',
									},
								},
							},
						},
					},
				},
			},
			readme:
				'## 🔎 What is a Google scraper?\n\nOur free SERP scraper crawls Google Search Results Pages (SERPs) and extracts data from those web pages in structured formats such as JSON, XML, CSV, or Excel. To extract images, visit our [Google Images Scraper](https://apify.com/hooli/google-images-scraper). With this SERP Scraper API, you will be able to **extract the following Google data from each Google page**:\n\n<table>\n<tr>\n<td> 🌱 Organic results </td>\n<td> 🛍 Paid results </td>\n</tr>\n<tr>\n<td> 🤖 AI Overviews </td>\n<td> 📢 Product ads </td>\n</tr>\n<tr>\n<td> ❓ Related queries </td>\n<td> 🙋‍♀️ People Also Ask </td>\n</tr>\n<tr>\n<td> 🏷 Prices </td>\n<td> ⭐️ Review rating and review count  </td>\n</tr>\n<tr>\n<td> 🪴 Suggested results </td>\n<td> 🔍 Additional custom attributes  </td>\n</tr>\n</table>\n\n## 💯 How many results can you scrape with Google Search Scraper?\n\nGoogle Search Scraper can return **up to 300 results for one keyword**. This is due to the limitations of Google itself: although it shows as if it has millions of results for a given search query, Google will always display a maximum of three pages. With a maximum 100 results shown per page, this makes up to 300 results in total.\n\nIf your use case doesn\'t require otherwise, we strongly recommend you to keep the setting or  **`Results per Google page`** to the max 100, so that you get 100 results per 1 page instead of crawling 10 pages, each with 10 results. The 10 by 10 is also possible but since you’re paying for request, it will be ten times more pricey than it could’ve been).\n\nWhile we regularly run Actor tests to keep the benchmarks in check, the results may also fluctuate without our knowing. The best way to know for sure for your particular use case is to do a test run yourself.\n\n## 💸 How much will scraping Google Search cost you?\n\nGoogle Search Scraper uses the Pay-per-result pricing model, so your costs can be easily calculated: it will cost you $3.50 to scrape 1,000 search results, so $0.0035 per item. With Apify’s [Free plan](https://apify.com/pricing), you get $5 in usage credits every month, allowing you to **scrape over 1,400 results from Google for free**.\n\nIf you need to scrape data regularly, we recommend getting an Apify subscription. The [$49/month Starter plan](https://apify.com/pricing) can get you **over 14,000 Google results each month**.\n\n## ⬇️ Google Search data input\n\nThe scraper gives you really good control over what kind of Google Search results you\'ll get. You can specify the following settings:\n\n- Query phrases or raw Google search URLs 🔍\n- Country/search domain 🗺\n- Language of search 🇬🇧\n- Exact geolocation 📍\n- Number of results per page 🔟\n- Mobile or desktop version results 📱\n\nFor a complete description of all settings, see the [Input tab](https://apify.com/apify/google-search-scraper/input-schema).\n\n### How to scrape Google Search results by URL or keyword\n\nThere are two ways you can scrape Google search pages: either by URL or by search term.\n\n1. Scraping **by URL** will get you data from Google Search results page. You\'ll get Google data from a copy-pasted Google URL with any Google country domain (e.g. `google.co.uk`). You can add as many URLs as you want.\n2. Scraping **by search term** will also get you data from Google Search results page. You can also add as many search terms as you want.\n\n#### Example input for scraping Google Search search term\n\nIt is also easy to get Google search data by search term. Just enter the search term and a number of Google pages to scrape. With this option, you also can:\n\n- scrape by multiple keywords in parallel by adding more search terms and separating them by a new line\n- indicate how many results you want to see per each Google page (10-100)\n- indicate the country of search (domain), language, and UULE location parameter\n\n<a href="https://console.apify.com/actors/nFJndFXA5zjCTuudP/input">\n    <img width="75%" src="https://i.imgur.com/mIYv0eZ.png" />\n</a>\n\nHere\'s its equivalent in JSON:\n\n```json\n{\n  "countryCode": "us",\n  "customDataFunction": "async ({ input, $, request, response, html }) => {\\\\\\\\n  return {\\\\\\\\n    pageTitle: $(\'title\').text(),\\\\\\\\n  };\\\\\\\\n};",\n  "includeUnfilteredResults": false,\n  "languageCode": "en",\n  "maxPagesPerQuery": 2,\n  "mobileResults": false,\n  "queries": "hotels in Seattle \\\\n hotels in New York",\n  "resultsPerPage": 10,\n  "saveHtml": false,\n  "saveHtmlToKeyValueStore": false,\n  "maxConcurrency": 10\n}\n\n```\n\n#### Scrape Google Search results by URL\n\nTo input URLs instead, simply replace `queries` with full URLs:\n\n```json\n"queries": "<https://www.google.com/search?q=hotels+in+Seattle> \\\\n <https://www.google.com/search?q=hotels+in+New+York>",\n\n```\n\n## ⬆️ Google Search data output\n\nThe scraper stores its result in the default [dataset](https://apify.com/docs/storage#dataset) associated with the scraper run, from which you can export it to various formats, such as JSON, XML, CSV, or Excel.\n\n### Output example (by search term)\n\nFor each Google Search results page, the dataset will contain a single record, which looks as follows. Note that the output preview will be organized in table and tabs for viewing convenience:\n\n[![Google SERP API Scraper](https://github.com/natashalekh/natashalekh.github.io/blob/main/Google%20SERP%20API%20Scraper.gif?raw=true)](https://console.apify.com/actors/nFJndFXA5zjCTuudP/input)\n\n\nAnd here’s the equivalent of the same scraped data but in JSON. Bear in mind that some fields have example values: <br>\n\n```json\n{\n    "searchQuery": {\n        "term": "hotels in seattle",\n        "url": "<http://www.google.com/search?num=100&q=hotels%20in%20seattle>",\n        "device": "DESKTOP",\n        "page": 1,\n        "type": "SEARCH",\n        "domain": "google.com",\n        "countryCode": "US",\n        "languageCode": null,\n        "locationUule": null,\n        "resultsPerPage": "100"\n    },\n    "url": "<http://www.google.com/search?num=100&q=hotels%20in%20seattle>",\n    "hasNextPage": true,\n    "serpProviderCode": "N",\n    "resultsTotal": 54000000,\n    "relatedQueries": [\n        {\n            "title": "Feedback",\n            "url": "<https://www.google.com/#>"\n        },\n        {\n            "title": "Hyatt Regency Seattle",\n            "url": "<https://www.google.com/search?num=100&q=Hyatt+Regency+Seattle&stick=H4sIAAAAAAAAAOOQUeLSz9U3MDHOSTEwNRJNzsnMTSxJVSjISU1JT1XIyC9JzSmOEoTQCpl5CsWpiSUlOamnGJG0QTlGVWbpBkVQTm5ZXnFG8ilGHv10fcPKXAujksKUNKhceVp6RVI5lGOcYZicnnSKkRuksCSl2CwlJ_cXo6gz1CEByA5pYGFcxCrqUQl0gkJQanpqXnKlQjDEQbfYJBlKnl2b9VUhNGan8tzMrdvyU0SSttVPXDDVAAAvau1f5QAAAA&sa=X&ved=2ahUKEwiRxJ_e2J__AhUVZTABHRosAFcQs9oBKAB6BAgXEAI>"\n        }\n        // ... and many more\n    ],\n    "paidResults": [\n        {\n            "title": "Hotels in Seattle, WA - Lowest Price Guarantee.",\n            "url": "<https://www.google.com/aclk?sa=l&ai=DChcSEwiMzqXe2J__AhW_gVoFHbh6BGYYABABGgJ2dQ&sig=AOD64_3PbWI_s3u1fE0Dh4Dobi56jDDCfw&q&adurl>",\n            "displayedUrl": "",\n            "description": "",\n            "emphasizedKeywords": [],\n            "siteLinks": [\n                {\n                    "title": "",\n                    "url": "<https://www.google.com/aclk?sa=l&ai=DChcSEwiMzqXe2J__AhW_gVoFHbh6BGYYABAHGgJ2dQ&sig=AOD64_3x8pu1mywduFwZgi9cwut7L9Nrvg&q=&ved=2ahUKEwiRxJ_e2J__AhUVZTABHRosAFcQh78CegQIDhAB&adurl=>",\n                    "description": ""\n                },\n                {\n                    "title": "Hotels at Great Prices",\n                    "url": "<https://www.google.com/aclk?sa=l&ai=DChcSEwiMzqXe2J__AhW_gVoFHbh6BGYYABADGgJ2dQ&sig=AOD64_1Bl0Ju75dgDPwLJAb53UYrV1xyMQ&q&adurl>",\n                    "description": ""\n                }\n                // ... and many more\n            ],\n            "type": "paid",\n            "adPosition": 1\n        },\n        {\n            "title": "Cheap Hotels in Seattle - Best Deals in Seattle",\n            "url": "<https://www.google.com/aclk?sa=l&ai=DChcSEwiMzqXe2J__AhW_gVoFHbh6BGYYABAAGgJ2dQ&sig=AOD64_27qRewPYeehK82DHa3ck7RlyilRg&q&adurl>",\n            "displayedUrl": "",\n            "description": "",\n            "emphasizedKeywords": [],\n            "siteLinks": [\n                {\n                    "title": "",\n                    "url": "<https://www.google.com/aclk?sa=l&ai=DChcSEwiMzqXe2J__AhW_gVoFHbh6BGYYABACGgJ2dQ&sig=AOD64_0sufwpcy9IZTR-ZX82HaFX1Xqc-w&q=&ved=2ahUKEwiRxJ_e2J__AhUVZTABHRosAFcQh78CegQIBxAB&adurl=>",\n                    "description": ""\n                }\n            ],\n            "type": "paid",\n            "adPosition": 2\n        }\n    ],\n    "paidProducts": [],\n    "organicResults": [\n        {\n            "title": "The Best Hotels in Seattle, WA",\n            "url": "<https://www.hotels.com/de1481165/hotels-seattle-washington/>",\n            "displayedUrl": "<https://www.hotels.com> › ... › Hotels in Washington",\n            "description": "The Inn at Virginia Mason · The Belltown Inn · Hyatt Regency Seattle · Mediterranean Inn · Hotel Max · Crowne Plaza Seattle - Downtown, an IHG Hotel · Mayflower Park ...",\n            "emphasizedKeywords": [\n                "Seattle",\n                "Hotel",\n                "Seattle",\n                "Hotel"\n            ],\n            "siteLinks": [],\n            "productInfo": {},\n            "type": "organic",\n            "position": 1\n        },\n        {\n            "title": "THE 10 BEST Hotels in Seattle, WA 2023 (from $87)",\n            "url": "<https://www.tripadvisor.com/Hotels-g60878-Seattle_Washington-Hotels.html>",\n            "displayedUrl": "<https://www.tripadvisor.com> › ... › Seattle Hotels",\n            "description": "Popular hotels in Seattle right now · 1. Embassy Suites by Hilton Seattle Downtown Pioneer Square · 1,293 reviews · 2. Hyatt Regency Seattle · 1,917 reviews · 3.",\n            "emphasizedKeywords": [\n                "hotels in Seattle"\n            ],\n            "siteLinks": [],\n            "productInfo": {},\n            "type": "organic",\n            "position": 2\n        }\n        // ... and many more\n    ],\n    "peopleAlsoAsk": [\n        {\n            "question": "Is it better to stay in downtown Seattle or?",\n            "answer": "For most visitors, the best area to stay is downtown Seattle (and near Pike Place Market). Downtown is where most of Seattle\'s best hotels, top restaurants, attractions, and shopping are located – all within an area dense, compact, and walkable.",\n            "url": "<https://santorinidave.com/best-places-seattle#:~:text=For%20most%20visitors%2C%20the%20best,dense%2C%20compact%2C%20and%20walkable.">,\n            "title": "WHERE TO STAY in SEATTLE - Best Areas & Neighborhoods",\n            "date": "May 9, 2023"\n        },\n        {\n            "question": "Is it easy to get around Seattle without a car?",\n            "answer": "You can easily get around Seattle without a car. Places like Pike Place Market, the Seattle Center, the waterfront, and a lot of neighborhoods are walkable.",\n            "url": "<https://travellemming.com/getting-around-seattle/#:~:text=You%20can%20easily%20get%20around,lot%20of%20neighborhoods%20are%20walkable.">,\n            "title": "Getting Around Seattle (A Local\'s Transportation Guide)",\n            "date": "Jan 13, 2023"\n        },\n        {\n            "question": "Where not to stay in downtown Seattle?",\n            "answer": "Avoid downtown Seattle\'s 3rd Avenue, particularly between Pike and Pine, and James and Yesler. Pioneer Square, SoDo, the International District, First Hill, and certain parts of Belltown can be a bit sketchy. That said, visitors should exercise caution when exploring at night.",\n            "url": "<https://travellemming.com/is-seattle-safe/#:~:text=Avoid%20downtown%20Seattle\'s%203rd%20Avenue,caution%20when%20exploring%20at%20night.">,\n            "title": "Is Seattle Safe in 2023? (Honest Info From a Local) - Travel Lemming",\n            "date": "Feb 16, 2023"\n        },\n        {\n            "question": "Should I stay in West Seattle?",\n            "answer": "West Seattle Don\'t get me wrong: West Seattle is a great place. In fact, I highly recommend taking a half-day or day to visit the area if you have the time during your Seattle trip. Especially along Alki Beach, you can enjoy sweeping views of Puget Sound and the Seattle skyline, plus enjoy local food and drink.",\n            "url": "<https://www.valisemag.com/where-to-stay-seattle/#:~:text=5.-,West%20Seattle,enjoy%20local%20food%20and%20drink.">,\n            "title": "The 10 Best Areas to Stay in Seattle (& Where Not To!) - Valerie & Valise",\n            "date": "Sep 29, 2020"\n        }\n    ],\n    "customData": {\n        "pageTitle": "hotels in seattle - Google Search"\n    }\n}\n\n```\n\n<br> You can **download the results directly from the platform using a button** or from the [Get dataset items](https://www.apify.com/docs/api/v2#/reference/datasets/item-collection/get-items) API endpoint:\n\n```json\n<https://api.apify.com/v2/datasets/[DATASET_ID]/items?format=[FORMAT]>\n\n```\n\nwhere `[DATASET_ID]` is the ID of the dataset and `[FORMAT]`can be `csv`, `html`, `xlsx`, `xml`, `rss` or `json`.\n\n## 🧑‍🏫 How do I use Google SERP Scraper?\n\nTo understand how to set up and run the Google SERP Scraper (or Google SERP API), check out our step-by-step guide on [how to scrape Google Search](https://blog.apify.com/unofficial-google-search-api-from-apify-22a20537a951) with screenshots and examples or [watch a short video tutorial](https://www.youtube.com/watch?v=wjLskDlPfvo)  ▷ on YouTube.\n\n[google scraping](https://www.youtube.com/watch?v=wjLskDlPfvo)\n\n## ❓FAQ\n\n### 📚 Resources on how to use Google SERP API to scrape Google\n\n1. [Is web scraping legal?](https://blog.apify.com/is-web-scraping-legal/) - blogpost on ethical scraping.\n2. [Platform pricing page](https://apify.com/pricing/actors) with pricing specifications.  \n3. [Video guide ▷](https://www.youtube.com/watch?v=-wyz2iscZ30) on how to count the usage of Google Search API.\n4. [Step-by-step guide](https://blog.apify.com/unofficial-google-search-api-from-apify-22a20537a951/) on how to use Google SERP scraper. \n5. [Video tutorial ▷](https://www.youtube.com/watch?v=Zvr4awK92oo) on how to use Google Images scraper.\n6. [Video tutorial ▷](https://www.youtube.com/watch?v=wjLskDlPfvo) on how to use Google SERP scraper.\n7. [Input tab](https://apify.com/apify/google-search-scraper/input-schema) with all the technical parameters of this scraper.\n8. A list of other [Google-related scrapers.](https://apify.com/store?search=google)\n\n### Want to scrape images from Google?\n\nIf you\'re looking to scrape specific [data from public Google services](https://apify.com/store/categories?search=google), you\'re in luck! Whether it\'s for extracting location details, reviews, trends, or even job listings, there’s a dedicated scraper for each case. Browse through these tailored solutions to find the one that fits your needs:\n\n<table>\n<tr>\n<td>📍 <a href="https://apify.com/compass/google-maps-extractor">Google Maps Extractor</a></td>\n<td>👁 <a href="https://apify.com/alexey/google-lens">Google Lens Scraper</a></td>\n</tr>\n<tr>\n<td>🎓 <a href="https://apify.com/marco.gullo/google-scholar-scraper">Google Scholar Scraper</a></td>\n<td>🛍 <a href="https://apify.com/emastra/google-shopping-scraper">Google Shopping Scraper</a></td>\n</tr>\n<tr>\n<td>📈 <a href="https://apify.com/emastra/google-trends-scraper">Google Trends Scraper</a></td>\n<td>⭐️ <a href="https://apify.com/compass/google-maps-reviews-scraper">Google Reviews Scraper</a></td>\n</tr>\n<tr>\n<td>🖼 <a href="https://apify.com/hooli/google-images-scraper">Google Images Scraper</a></td>\n<td>🗞 <a href="https://apify.com/lhotanova/google-news-scraper">Google News Scraper</a></td>\n</tr>\n<tr>\n<td>🧾 <a href="https://apify.com/silva95gustavo/google-ads-scraper">Google News Scraper</a></td>\n<td>📇 <a href="https://apify.com/epctex/google-jobs-scraper">Google Jobs Scraper</a></td>\n</tr>\n</table>\n\n#### How do I scrape millions of results from Google?\n\nPlease note that, although Google always shows that it has found millions of results, **Google will never display more than a few hundred results for a single search query** 🤥 If your goal is to get as many results as possible, try creating many similar queries and combine different parameters and locations.\n\n#### How do I scrape Google ads?\n\nDespite the fact that scraping Google is the best shot we\'ve got at seeing objective Google results, **displayed paid results are still heavily dependent on your location and browsing history**. It’s also up to Google to choose which ads to show to which user (hello, cookies 🍪). It might be underwhelming to see less results than you\'d expected. Most probably, Google\'s precise algorithm is the reason for it.\n\n#### Is it legal to scrape Google search results?\n\nWeb scraping is legal if you are extracting publicly available data, but you should respect boundaries such as personal data and intellectual property regulations.\nRule of thumb is: you should only scrape personal data if you have a legitimate reason to do so, factoring in Google\'s [Terms of Use](https://policies.google.com/terms?hl=en) as well. If you\'re unsure whether your reason is legitimate, consult your lawyers. We also recommend that you read our blog post on the subject: [is web scraping legal?](https://blog.apify.com/is-web-scraping-legal/)\n\n\n#### How can I use data scraped from Google Search?\n\nGoogle SERP API has a lot to offer in terms of how extracted Google data can be applied:\n\n🔸 **Use it for search engine optimization (SEO)** and monitor how your website performs on Google for certain queries over time.\n\n🔹 **Monitor how frequently a search term has been used** on Google, and how it compares with total search volume.\n\n🔸 **Analyze display ads** for a given set of keywords.\n\n🔹 **Monitor your competition** in both organic and paid results.\n\n🔸 **Build a URL list for certain keywords**. This is useful if, for example, you need good relevant starting points when scraping web pages containing specific phrases.\n\n🔹 **Analyze Google algorithm** and identify its main trends\n\n#### Can I integrate Google Scraper with other apps?\n\nLast but not least, this Google SERP API can be connected with almost any cloud service or web app thanks to [integrations on the Apify platform](https://apify.com/integrations). You can integrate with Make, Zapier, Slack, Airbyte, GitHub, Google Sheets, Google Drive, [and more](https://docs.apify.com/integrations). Or you can use [webhooks](https://docs.apify.com/integrations/webhooks) to carry out an action whenever an event occurs, e.g. get a notification whenever Google Search Results Scraper successfully finishes a run.\n\n#### Can I use Google Scraper with the API?\n\nThe Apify API gives you programmatic access to the Apify platform. The API is organized around RESTful HTTP endpoints that enable you to manage, schedule, and run Apify Actors. The API also lets you access any datasets, monitor actor performance, fetch results, create and update versions, and more.\n\nTo access the API using Node.js, use the `apify-client` NPM package. To access the API using Python, use the `apify-client` PyPi package.\n\nCheck out the [Apify API reference docs](https://docs.apify.com/api/v2) for full details or click on the [API tab](https://apify.com/apify/google-search-scraper/api/javascript) for code examples. You can also follow [this video guide](ttps://www.youtube.com/watch?v=ViYYDHSBAKM).\n\n#### How to get one search result per row\n\nSimply choose the Export view for `Organic results` and/or `Paid results`, it automatically spreads each result into a separate row. For API access, you can add `&view=paid_results` or `&view=organic_results` to the URL and with the API client, you can do the same using the `view` field.\n\nAn organic result is represented using the following format:\n\n```json\n{\n  "searchQuery": {\n    "term": "laptop",\n    "device": "DESKTOP",\n    "page": 1,\n    "type": "SEARCH",\n    "domain": "google.com",\n    "countryCode": "US",\n    "languageCode": "en",\n    "locationUule": null,\n    "resultsPerPage": 10\n  },\n  "type": "organic",\n  "position": 1,\n  "title": "Laptops & Notebook Computers - Best Buy",\n  "url": "<https://www.bestbuy.com/site/computers-pcs/laptop-computers/abcat0502000.c?id=abcat0502000>",\n  "displayedUrl": "<https://www.bestbuy.com> › Computers & Tablets",\n  "description": "Shop Best Buy for laptops. Work & play from anywhere with a notebook computer. We can help you find the best laptop for your specific needs in store and online.",\n  "emphasizedKeywords": "laptops | laptop",\n  "productInfo": {}\n}\n\n```\n\nA paid result has an `adPosition` field instead of `position` and `"type": "paid"`. **Paid result position is calculated separately from the organic results**.\n\nWhen using a tabular format such as `csv` or `xls`, you\'ll get a table where each row contains just one organic result. For more details about exporting and formatting the dataset records, please see the documentation for the [Get dataset items](https://apify.com/docs/api/v2#/reference/datasets/item-collection/get-items) API endpoint.\n\n#### Not your cup of tea? Build your own scraper.\n\nThis Google SERP API doesn’t exactly do what you need? You can always build your own! We have various [scraper templates](https://apify.com/templates) in Python, JavaScript, and TypeScript to get you started. Alternatively, you can write it from scratch using our [open-source library Crawlee](https://crawlee.dev/). You can keep the scraper to yourself or make it public by adding it to Apify Store (and [find users](https://apify.com/partners/actor-developers) for it).\n\n\n#### Your feedback\n\nIf you are not sure that the results are complete and of good quality, each run stores the full HTML page to the default Key-Value Store. You can view the KVS by clicking on it and comparing the results. \n\nWe’re always working on improving the performance of our Actors and monitoring the quality but we are happy for any reports. So if you’ve got any technical feedback for this Google SERP API or simply found a bug, please create an issue on the Actor’s [Issues tab](https://apify.com/apify/google-search-scraper/issues/open).\n',
			input: {
				title: 'Google Search Scraper input',
				description:
					"Use this search the same way you would use Google, you can e.g. look for <code>cute cats</code>. Use a new line for each query. \n Click &#9655; <strong> Start </strong> to begin the scrape. If you need any guidance, just <a href='https://blog.apify.com/unofficial-google-search-api-from-apify-22a20537a951/#how-to-scrape-google-search-pages' target='_blank' rel='noopener'>follow this tutorial.</a>",
				type: 'object',
				schemaVersion: 1,
				properties: {
					queries: {
						title: 'Search term(s)',
						type: 'string',
						description:
							'Use regular search words or enter Google Search URLs. You can also apply [advanced Google search techniques](https://blog.apify.com/how-to-scrape-google-like-a-pro/), such as <code>AI site:twitter.com</code> or <code>javascript OR python</code>. You can also define selected search filters as separate fields below (in the <code>Advanced search filters</code> section). Just ensure that your queries do not exceed 32 words to comply with Google Search limits.',
						prefill: 'javascript\ntypescript\npython',
						editor: 'textarea',
						pattern: '[^\\s]+',
					},
					resultsPerPage: {
						title: 'Results per page',
						type: 'integer',
						description: '',
						maximum: 100,
						minimum: 1,
						prefill: 100,
						sectionCaption: 'Number of results',
						sectionDescription:
							'Google usually returns about 200 results per search. By default it displays about 20-30 pages with 10 results per page, but you can switch it to display 100 results - and then Google will only show 2 to 3 pages. \n This is a more efficient option for scraping as you get more results with one request.',
					},
					maxPagesPerQuery: {
						title: 'Max pages per search',
						type: 'integer',
						description: '',
						prefill: 1,
						minimum: 1,
					},
					focusOnPaidAds: {
						title: 'Add-on: Enable paid results (ads) extraction',
						type: 'boolean',
						description:
							'Enable extraction of paid results (Google Ads). This feature improves ad detection accuracy by using an ad-specialized proxy to perform 3 checks on each search page. Best used for queries likely to show ads. Extra cost per search page applies when enabled, regardless of ads found. Pricing depends on your Apify subscription plan.',
						default: false,
						sectionCaption: '📢 Add-on: Paid results (ads) extraction',
						sectionDescription:
							'How it works:</b> When enabled, for each processed search page, the Actor performs a sequence of 3 checks using an <b>ad-specialized proxy server</b> to determine if paid advertisements are present. This 3-check process ensures higher <b>accuracy</b> in determining the presence or absence of ads on that search page. <br><br><b>Usage Recommendation:</b> This feature is most effective and cost-efficient when used for search queries that have a high probability of displaying ads. Avoid enabling it for general scraping tasks where ads are not a primary focus to optimize your costs. <br><br><b>Important:</b> An extra cost applies per search page for invoking this 3-check ad detection process when the feature is active. This cost is incurred even if no ads are found, as the value lies in the comprehensive check. The specific price for this add-on varies based on your Apify subscription plan. Please refer to your subscription details in the Apify Console.',
					},
					countryCode: {
						sectionCaption: 'Location and language',
						title: 'Country',
						type: 'string',
						description:
							'Specifies the country used for the search and the Google Search domain (e.g. <code>google.es</code> for Spain). By default, the actor uses United States (<code>google.com</code>).',
						editor: 'select',
						enum: [],
						enumTitles: [],
					},
					searchLanguage: {
						title: 'Search language',
						type: 'string',
						description:
							"Restricts search results to pages in a specific language. For example, choosing 'German' results in pages only in German. Passed to Google Search as the <code>lr</code> URL query parameter. <a href='https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list' target='_blank'>Read more here</a>.",
						default: '',
						editor: 'select',
						enum: [],
						enumTitles: [],
					},
					languageCode: {
						title: 'Interface Language',
						type: 'string',
						description:
							"Language of the Google Search interface (menus, buttons, etc. - not the search results themselves). Passed to Google Search as the <code>hl</code> URL query parameter. From Google Reference: You can use the <code>hl</code> request parameter to identify the language of your graphical interface. The <code>hl</code> parameter value may affect search results, especially on international queries when language restriction (using the <code>lr</code> parameter) is not explicitly specified. <a href='https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list' target='_blank'>Read more here</a>.",
						default: '',
						editor: 'select',
						enum: [],
						enumTitles: [],
					},
					locationUule: {
						title: 'Exact location (Google UULE parameter)',
						type: 'string',
						description:
							"The code for the exact location for the Google search. It's passed to Google Search as the <code>uule</code> URL query parameter. You can use the <a href='https://padavvan.github.io/' target='_blank'>UULE code generator</a>. Learn more about <a href='https://moz.com/ugc/geolocation-the-ultimate-tip-to-emulate-local-search' target='_blank'>emulating local search</a>.",
						editor: 'textfield',
					},
					forceExactMatch: {
						title: 'Force exact match',
						type: 'boolean',
						description:
							'If checked, the scraper will search for the exact phrase in the query. This is done by wrapping the query in quotes. Note that this may return fewer results. Also note that if you\'re using operators such as OR or AND, the whole query will be wrapped in quotes, such as <code>"Windows AND macOS"</code>. If you want to search for queries such as <code>"Windows" AND "macOS"</code>, you need to specify them directly in the <code>queries</code> field.',
						default: false,
						sectionCaption: 'Advanced search filters',
						sectionDescription:
							'Use these filters to narrow down your search results. You can use them in combination with your search terms above. Each filter will be applied to all queries except for the ones that already contain the given filter. For example, if you have a query <code>literature site:example.com</code>, the <code>site</code> filter will not be applied to it.',
					},
					site: {
						title: 'Site',
						type: 'string',
						description:
							'Limits the search to a specific site, such as: <code>site:example.com</code>. Note that the <code>site</code> filter takes precedence over the <code>relatedToSite</code> filter. If both filters are set, the <code>relatedToSite</code> filter will be ignored and not added to the search queries.',
						editor: 'textfield',
						pattern: '^([\\w-]+\\.)+\\w+$',
					},
					relatedToSite: {
						title: 'Related to site',
						type: 'string',
						description:
							'Filters pages related to a specific site, such as: <code>related:example.com</code>. Note that the <code>site</code> filter takes precedence over the <code>relatedToSite</code> filter. If both filters are set, the <code>relatedToSite</code> filter will be ignored and not added to the search queries.',
						editor: 'textfield',
						pattern: '^([\\w-]+\\.)+\\w+$',
					},
					wordsInTitle: {
						title: 'Words in title',
						type: 'array',
						description:
							'Filters pages with specific words in the title. The scraper uses the <code>intitle:</code> operator, even for multiple words (e.g. <code>recipe site:allrecipes.com intitle:"easy apple" intitle:pie</code>). There\'s also a <code>allintitle:</code> operator available, but it\'s problematic when combined with other search filters, so the scraper avoids using it. If you need to use the <code>allintitle:</code> operator specifically, you can include it in your custom queries from the <code>queries</code> field.',
						editor: 'stringList',
						patternValue: '^[^\\s](.+[^\\s])*$',
						maxItems: 32,
						default: [],
					},
					wordsInText: {
						title: 'Words in text',
						type: 'array',
						description:
							"Filters pages with specific words in the text. The scraper uses the <code>intext:</code> operator, even for multiple words (e.g. <code>cartoon site:wikipedia.com intext:cat intext:mouse</code>). There's also a <code>allintext:</code> operator available, but it's problematic when combined with other search filters, so the scraper avoids using it. If you need to use the <code>allintext:</code> operator specifically, you can include it in your custom queries from the <code>queries</code> field.",
						editor: 'stringList',
						patternValue: '^[^\\s](.+[^\\s])*$',
						maxItems: 32,
						default: [],
					},
					wordsInUrl: {
						title: 'Words in URL',
						type: 'array',
						description:
							"Filters pages with specific words in the URL. The scraper uses the <code>inurl:</code> operator, even for multiple words (e.g. <code>recipe site:allrecipes.com inurl:apple inurl:pie</code>). There's also a <code>allinurl:</code> operator available, but it's problematic when combined with other search filters, so the scraper avoids using it. If you need to use the <code>allinurl:</code> operator specifically, you can include it in your custom queries from the <code>queries</code> field.",
						editor: 'stringList',
						patternValue: '^[^\\s](.+[^\\s])*$',
						maxItems: 32,
						default: [],
					},
					quickDateRange: {
						title: 'Quick date range',
						type: 'string',
						description:
							"Filters results from a specific date range. d[number] specifies the number of past days (e.g. the past 10 days can be written as d10). The same applies to weeks, months, and years: w[number], m[number], y[number]. Example for the past year: '1y' or even 'y'. The value is passed to Google Search using the <code>tbs</code> URL query parameter, prefixed with <code>qdr:</code>. You should avoid combining this filter with the <code>beforeDate</code> and <code>afterDate</code> filters to prevent conflicts.",
						editor: 'textfield',
						pattern: '^[dwmy]\\d*$',
					},
					beforeDate: {
						title: 'Before date',
						type: 'string',
						description:
							'Filters results from before the specified date. Either absolute date (e.g. `2024-05-03`) or relative date from now into the past (e.g. `8 days`, `3 months`). JSON input also supports adding time in both absolute (ISO standard, e.g. `2024-05-03T20:00:00`) and relative (e.g. `3 hours`) formats. Absolute time is always interpreted in the UTC timezone, not your local timezone - please convert accordingly. Supported relative date & time units: `minutes`, `hours`, `days`, `weeks`, `months`, `years`. You should avoid combining this filter with the `quickDateRange` filter to prevent conflicts.',
						editor: 'datepicker',
						dateType: 'absoluteOrRelative',
						pattern:
							'^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])(T[0-2]\\d:[0-5]\\d(:[0-5]\\d)?(\\.\\d+)?Z?)?$|^(\\d+)\\s*(minute|hour|day|week|month|year)s?$',
					},
					afterDate: {
						title: 'After date',
						type: 'string',
						description:
							'Filters results from after the specified date. Either absolute date (e.g. `2024-05-03`) or relative date from now into the past (e.g. `8 days`, `3 months`). JSON input also supports adding time in both absolute (ISO standard, e.g. `2024-05-03T20:00:00`) and relative (e.g. `3 hours`) formats. Absolute time is always interpreted in the UTC timezone, not your local timezone - please convert accordingly. Supported relative date & time units: `minutes`, `hours`, `days`, `weeks`, `months`, `years`. You should avoid combining this filter with the `quickDateRange` filter to prevent conflicts.',
						editor: 'datepicker',
						dateType: 'absoluteOrRelative',
						pattern:
							'^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])(T[0-2]\\d:[0-5]\\d(:[0-5]\\d)?(\\.\\d+)?Z?)?$|^(\\d+)\\s*(minute|hour|day|week|month|year)s?$',
					},
					fileTypes: {
						title: 'File types',
						description:
							'Filters results of specific file types using the <code>filetype:</code> operator, such as <code>filetype:pdf</code>. You can select multiple file types as well. They will be combined with the <code>OR</code> operator, for example: <code>filetype:doc OR filetype:txt</code>. If you need to use a file type that is not in the list (such as a source code file type), you can include it in your custom queries from the <code>queries</code> field, using the <code>filetype:</code> operator.',
						type: 'array',
						editor: 'select',
						maxItems: 10,
						items: {
							type: 'string',
							enum: [
								'pdf',
								'csv',
								'epub',
								'ps',
								'htm',
								'html',
								'xls',
								'xlsx',
								'ppt',
								'pptx',
								'doc',
								'docx',
								'odp',
								'ods',
								'odt',
								'rtf',
								'svg',
								'tex',
								'txt',
								'wml',
								'wap',
								'xml',
								'xps',
								'md',
								'readme',
								'log',
								'yml',
								'yaml',
								'toml',
								'ipynb',
								'sas',
								'sql',
								'rdf',
								'avif',
								'avi',
								'mkv',
								'mov',
								'flv',
								'asf',
								'ogv',
							],
							enumTitles: [
								'Adobe Portable Document Format (pdf)',
								'Comma-Separated Values (csv)',
								'Electronic Publication (epub)',
								'Adobe PostScript (ps)',
								'HTML (htm)',
								'HTML (html)',
								'Microsoft Excel (xls)',
								'Microsoft Excel (xlsx)',
								'Microsoft PowerPoint (ppt)',
								'Microsoft PowerPoint (pptx)',
								'Microsoft Word (doc)',
								'Microsoft Word (docx)',
								'OpenOffice presentation (odp)',
								'OpenOffice spreadsheet (ods)',
								'OpenOffice text (odt)',
								'Rich Text Format (rtf)',
								'Scalable Vector Graphics (svg)',
								'TeX/LaTeX (tex)',
								'Text (txt)',
								'Wireless Markup Language (wml)',
								'Wireless Markup Language (wap)',
								'XML (xml)',
								'XML Paper Specification (xps)',
								'Markdown (md)',
								'Readme (readme)',
								'Log file (log)',
								'YAML (yml)',
								'YAML (yaml)',
								'TOML (toml)',
								'Jupyter Notebook (ipynb)',
								'SAS (sas)',
								'SQL (sql)',
								'Resource Description Framework (rdf)',
								'AV1 Image File Format (avif)',
								'Audio Video Interleave (avi)',
								'Matroska Multimedia Container (mkv)',
								'QuickTime Movie (mov)',
								'Flash Video (flv)',
								'Advanced Systems Format (asf)',
								'Ogg Video (ogv)',
							],
						},
					},
					mobileResults: {
						title: 'Mobile results',
						type: 'boolean',
						description:
							'If checked the scraper will return results for mobile version of Google search. Otherwise desktop results are returned.',
						default: false,
						sectionCaption: 'Additional settings',
					},
					includeUnfilteredResults: {
						title: 'Unfiltered results',
						type: 'boolean',
						description:
							'If checked the lower quality results that Google normally filters out will be included.',
						default: false,
					},
					saveHtml: {
						title: 'Save HTML to dataset',
						type: 'boolean',
						description:
							'If checked the HTML of the Google Search results pages will be stored to the default dataset, under the <code>html</code> property. This is useful if you need to process the HTML, but it makes the dataset large.',
						default: false,
					},
					saveHtmlToKeyValueStore: {
						title: 'Save HTML to key-value store',
						type: 'boolean',
						description:
							'If checked the HTML of the Google Search results pages will be stored to the default key-value store and links to the files stored to the dataset under the <code>htmlSnapshotUrl</code> property. This is useful for debugging since you can easily view the pages in the browser. However, the use of this feature may slow down the Actor.',
						default: true,
					},
					includeIcons: {
						title: 'Include icon image data (base64)',
						type: 'boolean',
						description:
							'If checked all of the results (organicResults, paidResults, suggestedResults) will contain Base64-encoded icon image data if found.',
						default: false,
					},
				},
				required: ['queries'],
			},
		},
		buildNumber: '0.0.165',
		usage: {
			ACTOR_COMPUTE_UNITS: 0.07605777777777778,
		},
		usageTotalUsd: 0.030423111111111113,
		usageUsd: {
			ACTOR_COMPUTE_UNITS: 0.030423111111111113,
		},
	};
};

export const getItemsResult = () => {
	return [
		{
			items: [
				{
					'#debug': {
						requestId: 'mLP4Zdz37yoTaQH',
						url: 'http://www.google.com/search?q=typescript&num=2',
						loadedUrl: 'http://www.google.com/search?q=typescript&num=2',
						method: 'GET',
						retryCount: 0,
						errorMessages: [],
						statusCode: 200,
					},
					'#error': false,
					searchQuery: {
						term: 'typescript',
						url: 'http://www.google.com/search?q=typescript&num=2',
						device: 'DESKTOP',
						page: 1,
						type: 'SEARCH',
						domain: 'google.com',
						countryCode: 'US',
						languageCode: null,
						locationUule: null,
						resultsPerPage: '2',
					},
					url: 'http://www.google.com/search?q=typescript&num=2',
					hasNextPage: true,
					serpProviderCode: 'L',
					resultsTotal: 148000000,
					relatedQueries: [
						{
							title: 'TypeScript tutorial',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+tutorial&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAhCEAE',
						},
						{
							title: 'TypeScript vs JavaScript',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+vs+JavaScript&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAhBEAE',
						},
						{
							title: 'TypeScript npm',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+npm&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAhAEAE',
						},
						{
							title: 'TypeScript operator',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+operator&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAg_EAE',
						},
						{
							title: 'TypeScript W3Schools',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+W3Schools&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAg7EAE',
						},
						{
							title: 'TypeScript download',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+download&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAg-EAE',
						},
						{
							title: 'Typescript github',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=Typescript+github&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAg9EAE',
						},
						{
							title: 'TypeScript install',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+install&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAg8EAE',
						},
						{
							title: 'TypeScript tutorial',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+tutorial&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAhCEAE',
						},
						{
							title: 'TypeScript vs JavaScript',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+vs+JavaScript&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAhBEAE',
						},
						{
							title: 'TypeScript npm',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+npm&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAhAEAE',
						},
						{
							title: 'TypeScript operator',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+operator&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAg_EAE',
						},
						{
							title: 'TypeScript W3Schools',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+W3Schools&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAg7EAE',
						},
						{
							title: 'TypeScript download',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+download&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAg-EAE',
						},
						{
							title: 'Typescript github',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=Typescript+github&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAg9EAE',
						},
						{
							title: 'TypeScript install',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=TypeScript+install&sa=X&ved=2ahUKEwjj9I7IjPeNAxXQ4skDHdzsMVwQ1QJ6BAg8EAE',
						},
					],
					paidResults: [],
					paidProducts: [],
					organicResults: [
						{
							title: 'TypeScript: JavaScript With Syntax For Types.',
							url: 'https://www.typescriptlang.org/',
							displayedUrl: 'https://www.typescriptlang.org',
							description:
								'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
							emphasizedKeywords: ['TypeScript'],
							siteLinks: [],
							productInfo: {},
							type: 'organic',
							position: 1,
						},
						{
							title: 'TypeScript Introduction',
							url: 'https://www.w3schools.com/typescript/typescript_intro.php',
							displayedUrl: 'https://www.w3schools.com › typescript_intro',
							description:
								'TypeScript is a syntactic superset of JavaScript which adds static typing. This basically means that TypeScript adds syntax on top of JavaScript, allowing ...',
							emphasizedKeywords: ['TypeScript'],
							siteLinks: [],
							productInfo: {},
							type: 'organic',
							position: 2,
						},
					],
					suggestedResults: [],
					peopleAlsoAsk: [],
					aiOverview: {
						type: 'live',
						content: '',
						sources: [],
					},
					customData: null,
					htmlSnapshotUrl:
						'https://api.apify.com/v2/key-value-stores/K1AdT7nsdFw2ThD5J/records/mLP4Zdz37yoTaQH-0.html',
				},
				{
					'#debug': {
						requestId: 'wHMKm6x65gIpI7J',
						url: 'http://www.google.com/search?q=javascript&num=2',
						loadedUrl: 'http://www.google.com/search?q=javascript&num=2',
						method: 'GET',
						retryCount: 0,
						errorMessages: [],
						statusCode: 200,
					},
					'#error': false,
					searchQuery: {
						term: 'javascript',
						url: 'http://www.google.com/search?q=javascript&num=2',
						device: 'DESKTOP',
						page: 1,
						type: 'SEARCH',
						domain: 'google.com',
						countryCode: 'US',
						languageCode: null,
						locationUule: null,
						resultsPerPage: '2',
					},
					url: 'http://www.google.com/search?q=javascript&num=2',
					hasNextPage: true,
					serpProviderCode: 'L',
					resultsTotal: 5850000000,
					relatedQueries: [
						{
							title: 'JavaScript download',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+download&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhGEAE',
						},
						{
							title: 'JavaScript tutorial',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+tutorial&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhFEAE',
						},
						{
							title: 'JavaScript code',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+code&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhEEAE',
						},
						{
							title: 'Enable JavaScript',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=Enable+JavaScript&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhDEAE',
						},
						{
							title: 'JavaScript compiler',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+compiler&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAg_EAE',
						},
						{
							title: 'JavaScript interview questions',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+interview+questions&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhAEAE',
						},
						{
							title: 'JavaScript - wikipedia',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+-+wikipedia&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhBEAE',
						},
						{
							title: 'JavaScript W3Schools',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+W3Schools&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhCEAE',
						},
						{
							title: 'JavaScript download',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+download&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhGEAE',
						},
						{
							title: 'JavaScript tutorial',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+tutorial&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhFEAE',
						},
						{
							title: 'JavaScript code',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+code&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhEEAE',
						},
						{
							title: 'Enable JavaScript',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=Enable+JavaScript&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhDEAE',
						},
						{
							title: 'JavaScript compiler',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+compiler&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAg_EAE',
						},
						{
							title: 'JavaScript interview questions',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+interview+questions&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhAEAE',
						},
						{
							title: 'JavaScript - wikipedia',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+-+wikipedia&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhBEAE',
						},
						{
							title: 'JavaScript W3Schools',
							url: 'https://www.google.com/search?num=2&sca_esv=881644282a8af5f4&gl=us&hl=en&q=JavaScript+W3Schools&sa=X&ved=2ahUKEwiCjKDIjPeNAxVJV0EAHQEfNt0Q1QJ6BAhCEAE',
						},
					],
					paidResults: [],
					paidProducts: [],
					organicResults: [
						{
							title: 'Learn JavaScript Online - Courses for Beginners - javascript ...',
							url: 'https://www.javascript.com/',
							displayedUrl: 'https://www.javascript.com',
							description:
								'JavaScript.com is a resource for the JavaScript community. You will find resources and examples for JavaScript beginners as well as support for JavaScript ...',
							emphasizedKeywords: ['JavaScript.com'],
							siteLinks: [],
							productInfo: {},
							type: 'organic',
							position: 1,
						},
						{
							title: 'JavaScript Tutorial',
							url: 'https://www.w3schools.com/js/',
							displayedUrl: 'https://www.w3schools.com › ...',
							description:
								'JavaScript is the programming language of the Web. JavaScript is easy to learn. This tutorial will teach you JavaScript from basic to advanced.',
							emphasizedKeywords: ['JavaScript'],
							siteLinks: [],
							productInfo: {},
							type: 'organic',
							position: 2,
						},
					],
					suggestedResults: [],
					peopleAlsoAsk: [],
					aiOverview: {
						type: 'live',
						content: '',
						sources: [],
					},
					customData: null,
					htmlSnapshotUrl:
						'https://api.apify.com/v2/key-value-stores/K1AdT7nsdFw2ThD5J/records/wHMKm6x65gIpI7J-0.html',
				},
			],
		},
	];
};

export const scrapeSingleUrlResult = () => {
	return [
		{
			items: [
				{
					url: 'https://docs.apify.com/academy/web-scraping-for-beginners',
					crawl: {
						loadedUrl: 'https://docs.apify.com/academy/web-scraping-for-beginners',
						loadedTime: '2025-06-16T23:34:15.523Z',
						referrerUrl: 'https://docs.apify.com/academy/web-scraping-for-beginners',
						depth: 0,
						httpStatusCode: 200,
					},
					metadata: {
						canonicalUrl: 'https://docs.apify.com/academy/web-scraping-for-beginners',
						title: '',
						description:
							'Learn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.',
						author: null,
						keywords: null,
						languageCode: 'en',
						openGraph: [
							{
								property: 'og:url',
								content: 'https://docs.apify.com/academy/web-scraping-for-beginners',
							},
							{
								property: 'og:locale',
								content: 'en',
							},
							{
								property: 'og:title',
								content: 'Web scraping basics for JavaScript devs | Academy | Apify Documentation',
							},
							{
								property: 'og:description',
								content:
									'Learn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.',
							},
							{
								property: 'og:image',
								content:
									'https://apify.com/og-image/docs-article?title=Web+scraping+basics+for+JavaScript+devs',
							},
						],
						jsonLd: null,
						headers: {
							':status': 200,
							'content-type': 'text/html; charset=utf-8',
							'content-length': '9859',
							server: 'nginx',
							'x-origin-cache': 'HIT',
							'last-modified': 'Mon, 16 Jun 2025 16:15:02 GMT',
							'access-control-allow-origin': '*',
							'strict-transport-security': 'max-age=31556952',
							'x-proxy-cache': 'MISS',
							'x-github-request-id': '48EF:29A380:237AB7:27223B:685043BF',
							'accept-ranges': 'bytes',
							via: '1.1 varnish, 1.1 b7f97186b1999ddac2896624abb211e4.cloudfront.net (CloudFront)',
							'x-served-by': 'cache-iad-kiad7000026-IAD',
							'x-cache-hits': '0',
							'x-timer': 'S1750090689.639343,VS0,VE18',
							'x-fastly-request-id': '3b0bec76ee796ada03210a986cd4e988e11c9276',
							'x-frame-options': 'SAMEORIGIN',
							date: 'Mon, 16 Jun 2025 23:34:15 GMT',
							'cache-control': 'max-age=600',
							expires: 'Mon, 16 Jun 2025 22:17:22 GMT',
							etag: 'W/"68504306-9443"',
							vary: 'Accept-Encoding',
							'x-cache': 'RefreshHit from cloudfront',
							'x-amz-cf-pop': 'CMH68-P1',
							'x-amz-cf-id': '0cBkRyhy38NBtROWSOOpRkjpZHBaoH4fCyDnQObNPKP4cA623n5SxA==',
						},
					},
					screenshotUrl: null,
					text: "Web scraping basics for JavaScript devs\nLearn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.\nWelcome to Web scraping basics for JavaScript devs, a comprehensive, practical and long form web scraping course that will take you from an absolute beginner to a successful web scraper developer. If you're looking for a quick start, we recommend trying this tutorial instead.\nThis course is made by Apify, the web scraping and automation platform, but we will use only open-source technologies throughout all academy lessons. This means that the skills you learn will be applicable to any scraping project, and you'll be able to run your scrapers on any computer. No Apify account needed.\nIf you would like to learn about the Apify platform and how it can help you build, run and scale your web scraping and automation projects, see the Apify platform course, where we'll teach you all about Apify serverless infrastructure, proxies, API, scheduling, webhooks and much more.\nWhy learn scraper development?​\nWith so many point-and-click tools and no-code software that can help you extract data from websites, what is the point of learning web scraper development? Contrary to what their marketing departments say, a point-and-click or no-code tool will never be as flexible, as powerful, or as optimized as a custom-built scraper.\nAny software can do only what it was programmed to do. If you build your own scraper, it can do anything you want. And you can always quickly change it to do more, less, or the same, but faster or cheaper. The possibilities are endless once you know how scraping really works.\nScraper development is a fun and challenging way to learn web development, web technologies, and understand the internet. You will reverse-engineer websites and understand how they work internally, what technologies they use and how they communicate with their servers. You will also master your chosen programming language and core programming concepts. When you truly understand web scraping, learning other technologies like React or Next.js will be a piece of cake.\nCourse Summary​\nWhen we set out to create the Academy, we wanted to build a complete guide to web scraping - a course that a beginner could use to create their first scraper, as well as a resource that professionals will continuously use to learn about advanced and niche web scraping techniques and technologies. All lessons include code examples and code-along exercises that you can use to immediately put your scraping skills into action.\nThis is what you'll learn in the Web scraping basics for JavaScript devs course:\nWeb scraping basics for JavaScript devs \nBasics of data extraction\nBasics of crawling\nBest practices\nRequirements​\nYou don't need to be a developer or a software engineer to complete this course, but basic programming knowledge is recommended. Don't be afraid, though. We explain everything in great detail in the course and provide external references that can help you level up your web scraping and web development skills. If you're new to programming, pay very close attention to the instructions and examples. A seemingly insignificant thing like using [] instead of () can make a lot of difference.\nIf you don't already have basic programming knowledge and would like to be well-prepared for this course, we recommend learning about JavaScript basics and CSS Selectors.\nAs you progress to the more advanced courses, the coding will get more challenging, but will still be manageable to a person with an intermediate level of programming skills.\nIdeally, you should have at least a moderate understanding of the following concepts:\nJavaScript + Node.js​\nIt is recommended to understand at least the fundamentals of JavaScript and be proficient with Node.js prior to starting this course. If you are not yet comfortable with asynchronous programming (with promises and async...await), loops (and the different types of loops in JavaScript), modularity, or working with external packages, we would recommend studying the following resources before coming back and continuing this section:\nasync...await (YouTube)\nJavaScript loops (MDN)\nModularity in Node.js\nGeneral web development​\nThroughout the next lessons, we will sometimes use certain technologies and terms related to the web without explaining them. This is because their knowledge will be assumed (unless we're showing something out of the ordinary).\nHTML\nHTTP protocol\nDevTools\njQuery or Cheerio​\nWe'll be using the Cheerio package a lot to parse data from HTML. This package provides an API using jQuery syntax to help traverse downloaded HTML within Node.js.\nNext up​\nThe course begins with a small bit of theory and moves into some realistic and practical examples of extracting data from the most popular websites on the internet using your browser console. Let's get to it!\nIf you already have experience with HTML, CSS, and browser DevTools, feel free to skip to the Basics of crawling section.",
					html: '<div id="readability-content"><h1>Web scraping basics for JavaScript devs</h1><div id="readability-page-1" class="page"><div><header></header>\n<p><strong>Learn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.</strong></p>\n<hr>\n<p>Welcome to <strong>Web scraping basics for JavaScript devs</strong>, a comprehensive, practical and long form web scraping course that will take you from an absolute beginner to a successful web scraper developer. If you\'re looking for a quick start, we recommend trying <a href="https://blog.apify.com/web-scraping-javascript-nodejs/" target="_blank" rel="noopener">this tutorial</a> instead.</p>\n<p>This course is made by <a href="https://apify.com/" target="_blank" rel="noopener">Apify</a>, the web scraping and automation platform, but we will use only open-source technologies throughout all academy lessons. This means that the skills you learn will be applicable to any scraping project, and you\'ll be able to run your scrapers on any computer. No Apify account needed.</p>\n<p>If you would like to learn about the Apify platform and how it can help you build, run and scale your web scraping and automation projects, see the <a href="https://docs.apify.com/academy/apify-platform">Apify platform course</a>, where we\'ll teach you all about Apify serverless infrastructure, proxies, API, scheduling, webhooks and much more.</p>\n<h2 id="why-learn">Why learn scraper development?<a href="#why-learn" aria-label="Direct link to Why learn scraper development?" title="Direct link to Why learn scraper development?">​</a></h2>\n<p>With so many point-and-click tools and no-code software that can help you extract data from websites, what is the point of learning web scraper development? Contrary to what their marketing departments say, a point-and-click or no-code tool will never be as flexible, as powerful, or as optimized as a custom-built scraper.</p>\n<p>Any software can do only what it was programmed to do. If you build your own scraper, it can do anything you want. And you can always quickly change it to do more, less, or the same, but faster or cheaper. The possibilities are endless once you know how scraping really works.</p>\n<p>Scraper development is a fun and challenging way to learn web development, web technologies, and understand the internet. You will reverse-engineer websites and understand how they work internally, what technologies they use and how they communicate with their servers. You will also master your chosen programming language and core programming concepts. When you truly understand web scraping, learning other technologies like React or Next.js will be a piece of cake.</p>\n<h2 id="summary">Course Summary<a href="#summary" aria-label="Direct link to Course Summary" title="Direct link to Course Summary">​</a></h2>\n<p>When we set out to create the Academy, we wanted to build a complete guide to web scraping - a course that a beginner could use to create their first scraper, as well as a resource that professionals will continuously use to learn about advanced and niche web scraping techniques and technologies. All lessons include code examples and code-along exercises that you can use to immediately put your scraping skills into action.</p>\n<p>This is what you\'ll learn in the <strong>Web scraping basics for JavaScript devs</strong> course:</p>\n<ul>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners">Web scraping basics for JavaScript devs</a>\n<ul>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/data-extraction">Basics of data extraction</a></li>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/crawling">Basics of crawling</a></li>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/best-practices">Best practices</a></li>\n</ul>\n</li>\n</ul>\n<h2 id="requirements">Requirements<a href="#requirements" aria-label="Direct link to Requirements" title="Direct link to Requirements">​</a></h2>\n<p>You don\'t need to be a developer or a software engineer to complete this course, but basic programming knowledge is recommended. Don\'t be afraid, though. We explain everything in great detail in the course and provide external references that can help you level up your web scraping and web development skills. If you\'re new to programming, pay very close attention to the instructions and examples. A seemingly insignificant thing like using <code>[]</code> instead of <code>()</code> can make a lot of difference.</p>\n<blockquote>\n<p>If you don\'t already have basic programming knowledge and would like to be well-prepared for this course, we recommend learning about <a href="https://developer.mozilla.org/en-US/curriculum/core/javascript-fundamentals/" target="_blank" rel="noopener">JavaScript basics</a> and <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors" target="_blank" rel="noopener">CSS Selectors</a>.</p>\n</blockquote>\n<p>As you progress to the more advanced courses, the coding will get more challenging, but will still be manageable to a person with an intermediate level of programming skills.</p>\n<p>Ideally, you should have at least a moderate understanding of the following concepts:</p>\n<h3 id="javascript-and-node">JavaScript + Node.js<a href="#javascript-and-node" aria-label="Direct link to JavaScript + Node.js" title="Direct link to JavaScript + Node.js">​</a></h3>\n<p>It is recommended to understand at least the fundamentals of JavaScript and be proficient with Node.js prior to starting this course. If you are not yet comfortable with asynchronous programming (with promises and <code>async...await</code>), loops (and the different types of loops in JavaScript), modularity, or working with external packages, we would recommend studying the following resources before coming back and continuing this section:</p>\n<ul>\n<li><a href="https://www.youtube.com/watch?v=vn3tm0quoqE&amp;ab_channel=Fireship" target="_blank" rel="noopener"><code>async...await</code> (YouTube)</a></li>\n<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration" target="_blank" rel="noopener">JavaScript loops (MDN)</a></li>\n<li><a href="https://javascript.plainenglish.io/how-to-use-modular-patterns-in-nodejs-982f0e5c8f6e" target="_blank" rel="noopener">Modularity in Node.js</a></li>\n</ul>\n<h3 id="general-web-development">General web development<a href="#general-web-development" aria-label="Direct link to General web development" title="Direct link to General web development">​</a></h3>\n<p>Throughout the next lessons, we will sometimes use certain technologies and terms related to the web without explaining them. This is because their knowledge will be <strong>assumed</strong> (unless we\'re showing something out of the ordinary).</p>\n<ul>\n<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener">HTML</a></li>\n<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP" target="_blank" rel="noopener">HTTP protocol</a></li>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/data-extraction/browser-devtools">DevTools</a></li>\n</ul>\n<h3 id="jquery-or-cheerio">jQuery or Cheerio<a href="#jquery-or-cheerio" aria-label="Direct link to jQuery or Cheerio" title="Direct link to jQuery or Cheerio">​</a></h3>\n<p>We\'ll be using the <a href="https://www.npmjs.com/package/cheerio" target="_blank" rel="noopener"><strong>Cheerio</strong></a> package a lot to parse data from HTML. This package provides an API using jQuery syntax to help traverse downloaded HTML within Node.js.</p>\n<h2 id="next">Next up<a href="#next" aria-label="Direct link to Next up" title="Direct link to Next up">​</a></h2>\n<p>The course begins with a small bit of theory and moves into some realistic and practical examples of extracting data from the most popular websites on the internet using your browser console. <a href="https://docs.apify.com/academy/web-scraping-for-beginners/introduction">Let\'s get to it!</a></p>\n<blockquote>\n<p>If you already have experience with HTML, CSS, and browser DevTools, feel free to skip to the <a href="https://docs.apify.com/academy/web-scraping-for-beginners/crawling">Basics of crawling</a> section.</p>\n</blockquote></div></div></div>',
					markdown:
						'# Web scraping basics for JavaScript devs\n\n**Learn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.**\n\n* * *\n\nWelcome to **Web scraping basics for JavaScript devs**, a comprehensive, practical and long form web scraping course that will take you from an absolute beginner to a successful web scraper developer. If you\'re looking for a quick start, we recommend trying [this tutorial](https://blog.apify.com/web-scraping-javascript-nodejs/) instead.\n\nThis course is made by [Apify](https://apify.com/), the web scraping and automation platform, but we will use only open-source technologies throughout all academy lessons. This means that the skills you learn will be applicable to any scraping project, and you\'ll be able to run your scrapers on any computer. No Apify account needed.\n\nIf you would like to learn about the Apify platform and how it can help you build, run and scale your web scraping and automation projects, see the [Apify platform course](https://docs.apify.com/academy/apify-platform), where we\'ll teach you all about Apify serverless infrastructure, proxies, API, scheduling, webhooks and much more.\n\n## Why learn scraper development?[​](#why-learn "Direct link to Why learn scraper development?")\n\nWith so many point-and-click tools and no-code software that can help you extract data from websites, what is the point of learning web scraper development? Contrary to what their marketing departments say, a point-and-click or no-code tool will never be as flexible, as powerful, or as optimized as a custom-built scraper.\n\nAny software can do only what it was programmed to do. If you build your own scraper, it can do anything you want. And you can always quickly change it to do more, less, or the same, but faster or cheaper. The possibilities are endless once you know how scraping really works.\n\nScraper development is a fun and challenging way to learn web development, web technologies, and understand the internet. You will reverse-engineer websites and understand how they work internally, what technologies they use and how they communicate with their servers. You will also master your chosen programming language and core programming concepts. When you truly understand web scraping, learning other technologies like React or Next.js will be a piece of cake.\n\n## Course Summary[​](#summary "Direct link to Course Summary")\n\nWhen we set out to create the Academy, we wanted to build a complete guide to web scraping - a course that a beginner could use to create their first scraper, as well as a resource that professionals will continuously use to learn about advanced and niche web scraping techniques and technologies. All lessons include code examples and code-along exercises that you can use to immediately put your scraping skills into action.\n\nThis is what you\'ll learn in the **Web scraping basics for JavaScript devs** course:\n\n*   [Web scraping basics for JavaScript devs](https://docs.apify.com/academy/web-scraping-for-beginners)\n    *   [Basics of data extraction](https://docs.apify.com/academy/web-scraping-for-beginners/data-extraction)\n    *   [Basics of crawling](https://docs.apify.com/academy/web-scraping-for-beginners/crawling)\n    *   [Best practices](https://docs.apify.com/academy/web-scraping-for-beginners/best-practices)\n\n## Requirements[​](#requirements "Direct link to Requirements")\n\nYou don\'t need to be a developer or a software engineer to complete this course, but basic programming knowledge is recommended. Don\'t be afraid, though. We explain everything in great detail in the course and provide external references that can help you level up your web scraping and web development skills. If you\'re new to programming, pay very close attention to the instructions and examples. A seemingly insignificant thing like using `[]` instead of `()` can make a lot of difference.\n\n> If you don\'t already have basic programming knowledge and would like to be well-prepared for this course, we recommend learning about [JavaScript basics](https://developer.mozilla.org/en-US/curriculum/core/javascript-fundamentals/) and [CSS Selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors).\n\nAs you progress to the more advanced courses, the coding will get more challenging, but will still be manageable to a person with an intermediate level of programming skills.\n\nIdeally, you should have at least a moderate understanding of the following concepts:\n\n### JavaScript + Node.js[​](#javascript-and-node "Direct link to JavaScript + Node.js")\n\nIt is recommended to understand at least the fundamentals of JavaScript and be proficient with Node.js prior to starting this course. If you are not yet comfortable with asynchronous programming (with promises and `async...await`), loops (and the different types of loops in JavaScript), modularity, or working with external packages, we would recommend studying the following resources before coming back and continuing this section:\n\n*   [`async...await` (YouTube)](https://www.youtube.com/watch?v=vn3tm0quoqE&ab_channel=Fireship)\n*   [JavaScript loops (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)\n*   [Modularity in Node.js](https://javascript.plainenglish.io/how-to-use-modular-patterns-in-nodejs-982f0e5c8f6e)\n\n### General web development[​](#general-web-development "Direct link to General web development")\n\nThroughout the next lessons, we will sometimes use certain technologies and terms related to the web without explaining them. This is because their knowledge will be **assumed** (unless we\'re showing something out of the ordinary).\n\n*   [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)\n*   [HTTP protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP)\n*   [DevTools](https://docs.apify.com/academy/web-scraping-for-beginners/data-extraction/browser-devtools)\n\n### jQuery or Cheerio[​](#jquery-or-cheerio "Direct link to jQuery or Cheerio")\n\nWe\'ll be using the [**Cheerio**](https://www.npmjs.com/package/cheerio) package a lot to parse data from HTML. This package provides an API using jQuery syntax to help traverse downloaded HTML within Node.js.\n\n## Next up[​](#next "Direct link to Next up")\n\nThe course begins with a small bit of theory and moves into some realistic and practical examples of extracting data from the most popular websites on the internet using your browser console. [Let\'s get to it!](https://docs.apify.com/academy/web-scraping-for-beginners/introduction)\n\n> If you already have experience with HTML, CSS, and browser DevTools, feel free to skip to the [Basics of crawling](https://docs.apify.com/academy/web-scraping-for-beginners/crawling) section.',
					debug: {
						requestHandlerMode: 'http',
					},
				},
			],
		},
	];
};

export const getKeyValueStoreRecordResult = () => {
	return [
		{
			storeId: 'yTfMu13hDFe9bRjx6',
			recordKey: 'https---docs-apify-com-academy-web-scraping-for-beginners-qofjrk.html',
			contentType: 'text/html',
			data: '<script>\nObject.defineProperty(document, \'cookie\', {\n    get: function() { return \'\'; },\n    set: function() { return true; }\n});\nif (cookieStore) {\n    cookieStore = {};\n}\n</script>\n<div id="readability-content"><h1>Web scraping basics for JavaScript devs | Academy</h1><div id="readability-page-1" class="page"><div><header></header>\n<p><strong>Learn how to develop web scrapers with this comprehensive and practical course. Go from beginner to expert, all in one place.</strong></p>\n<hr>\n<p>Welcome to <strong>Web scraping basics for JavaScript devs</strong>, a comprehensive, practical and long form web scraping course that will take you from an absolute beginner to a successful web scraper developer. If you\'re looking for a quick start, we recommend trying <a href="https://blog.apify.com/web-scraping-javascript-nodejs/" target="_blank" rel="noopener">this tutorial</a> instead.</p>\n<p>This course is made by <a href="https://apify.com/" target="_blank" rel="noopener">Apify</a>, the web scraping and automation platform, but we will use only open-source technologies throughout all academy lessons. This means that the skills you learn will be applicable to any scraping project, and you\'ll be able to run your scrapers on any computer. No Apify account needed.</p>\n<p>If you would like to learn about the Apify platform and how it can help you build, run and scale your web scraping and automation projects, see the <a href="https://docs.apify.com/academy/apify-platform">Apify platform course</a>, where we\'ll teach you all about Apify serverless infrastructure, proxies, API, scheduling, webhooks and much more.</p>\n<h2 id="why-learn">Why learn scraper development?<a href="#why-learn" aria-label="Direct link to Why learn scraper development?" title="Direct link to Why learn scraper development?">​</a></h2>\n<p>With so many point-and-click tools and no-code software that can help you extract data from websites, what is the point of learning web scraper development? Contrary to what their marketing departments say, a point-and-click or no-code tool will never be as flexible, as powerful, or as optimized as a custom-built scraper.</p>\n<p>Any software can do only what it was programmed to do. If you build your own scraper, it can do anything you want. And you can always quickly change it to do more, less, or the same, but faster or cheaper. The possibilities are endless once you know how scraping really works.</p>\n<p>Scraper development is a fun and challenging way to learn web development, web technologies, and understand the internet. You will reverse-engineer websites and understand how they work internally, what technologies they use and how they communicate with their servers. You will also master your chosen programming language and core programming concepts. When you truly understand web scraping, learning other technologies like React or Next.js will be a piece of cake.</p>\n<h2 id="summary">Course Summary<a href="#summary" aria-label="Direct link to Course Summary" title="Direct link to Course Summary">​</a></h2>\n<p>When we set out to create the Academy, we wanted to build a complete guide to web scraping - a course that a beginner could use to create their first scraper, as well as a resource that professionals will continuously use to learn about advanced and niche web scraping techniques and technologies. All lessons include code examples and code-along exercises that you can use to immediately put your scraping skills into action.</p>\n<p>This is what you\'ll learn in the <strong>Web scraping basics for JavaScript devs</strong> course:</p>\n<ul>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners">Web scraping basics for JavaScript devs</a>\n<ul>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/data-extraction">Basics of data extraction</a></li>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/crawling">Basics of crawling</a></li>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/best-practices">Best practices</a></li>\n</ul>\n</li>\n</ul>\n<h2 id="requirements">Requirements<a href="#requirements" aria-label="Direct link to Requirements" title="Direct link to Requirements">​</a></h2>\n<p>You don\'t need to be a developer or a software engineer to complete this course, but basic programming knowledge is recommended. Don\'t be afraid, though. We explain everything in great detail in the course and provide external references that can help you level up your web scraping and web development skills. If you\'re new to programming, pay very close attention to the instructions and examples. A seemingly insignificant thing like using <code>[]</code> instead of <code>()</code> can make a lot of difference.</p>\n<blockquote>\n<p>If you don\'t already have basic programming knowledge and would like to be well-prepared for this course, we recommend learning about <a href="https://developer.mozilla.org/en-US/curriculum/core/javascript-fundamentals/" target="_blank" rel="noopener">JavaScript basics</a> and <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors" target="_blank" rel="noopener">CSS Selectors</a>.</p>\n</blockquote>\n<p>As you progress to the more advanced courses, the coding will get more challenging, but will still be manageable to a person with an intermediate level of programming skills.</p>\n<p>Ideally, you should have at least a moderate understanding of the following concepts:</p>\n<h3 id="javascript-and-node">JavaScript + Node.js<a href="#javascript-and-node" aria-label="Direct link to JavaScript + Node.js" title="Direct link to JavaScript + Node.js">​</a></h3>\n<p>It is recommended to understand at least the fundamentals of JavaScript and be proficient with Node.js prior to starting this course. If you are not yet comfortable with asynchronous programming (with promises and <code>async...await</code>), loops (and the different types of loops in JavaScript), modularity, or working with external packages, we would recommend studying the following resources before coming back and continuing this section:</p>\n<ul>\n<li><a href="https://www.youtube.com/watch?v=vn3tm0quoqE&amp;ab_channel=Fireship" target="_blank" rel="noopener"><code>async...await</code> (YouTube)</a></li>\n<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration" target="_blank" rel="noopener">JavaScript loops (MDN)</a></li>\n<li><a href="https://javascript.plainenglish.io/how-to-use-modular-patterns-in-nodejs-982f0e5c8f6e" target="_blank" rel="noopener">Modularity in Node.js</a></li>\n</ul>\n<h3 id="general-web-development">General web development<a href="#general-web-development" aria-label="Direct link to General web development" title="Direct link to General web development">​</a></h3>\n<p>Throughout the next lessons, we will sometimes use certain technologies and terms related to the web without explaining them. This is because their knowledge will be <strong>assumed</strong> (unless we\'re showing something out of the ordinary).</p>\n<ul>\n<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener">HTML</a></li>\n<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP" target="_blank" rel="noopener">HTTP protocol</a></li>\n<li><a href="https://docs.apify.com/academy/web-scraping-for-beginners/data-extraction/browser-devtools">DevTools</a></li>\n</ul>\n<h3 id="jquery-or-cheerio">jQuery or Cheerio<a href="#jquery-or-cheerio" aria-label="Direct link to jQuery or Cheerio" title="Direct link to jQuery or Cheerio">​</a></h3>\n<p>We\'ll be using the <a href="https://www.npmjs.com/package/cheerio" target="_blank" rel="noopener"><strong>Cheerio</strong></a> package a lot to parse data from HTML. This package provides an API using jQuery syntax to help traverse downloaded HTML within Node.js.</p>\n<h2 id="next">Next up<a href="#next" aria-label="Direct link to Next up" title="Direct link to Next up">​</a></h2>\n<p>The course begins with a small bit of theory and moves into some realistic and practical examples of extracting data from the most popular websites on the internet using your browser console. <a href="https://docs.apify.com/academy/web-scraping-for-beginners/introduction">Let\'s get to it!</a></p>\n<blockquote>\n<p>If you already have experience with HTML, CSS, and browser DevTools, feel free to skip to the <a href="https://docs.apify.com/academy/web-scraping-for-beginners/crawling">Basics of crawling</a> section.</p>\n</blockquote></div></div></div>',
		},
	];
};

export const getActorWebhookResult = () => {
	return {
		data: {
			total: 2,
			count: 2,
			offset: 0,
			limit: 1000,
			desc: false,
			items: [
				{
					id: 'OYb2eUWmLC3UcIMMQ',
					createdAt: '2025-06-12T20:17:07.105Z',
					modifiedAt: '2025-06-12T20:17:07.105Z',
					userId: 'A9zwKYff2yyRmaqc9',
					isEnabled: true,
					isAdHoc: false,
					eventTypes: [
						'ACTOR.RUN.SUCCEEDED',
						'ACTOR.RUN.FAILED',
						'ACTOR.RUN.TIMED_OUT',
						'ACTOR.RUN.ABORTED',
					],
					condition: {
						actorId: 'nFJndFXA5zjCTuudP',
					},
					ignoreSslErrors: false,
					doNotRetry: false,
					requestUrl:
						'https://fcaa-193-165-0-33.ngrok-free.app/webhook/8856069e-bd4b-45b2-8042-5f18b9547804/webhook',
					payloadTemplate:
						'{\n    "userId": {{userId}},\n    "createdAt": {{createdAt}},\n    "eventType": {{eventType}},\n    "eventData": {{eventData}},\n    "resource": {{resource}}\n}',
					lastDispatch: {
						status: 'SUCCEEDED',
						finishedAt: '2025-06-17T08:58:14.804Z',
						removedAt: null,
					},
					stats: {
						totalDispatches: 8,
					},
					actionType: 'HTTP_REQUEST',
					shouldInterpolateStrings: false,
				},
				{
					id: 'WmLC3UcIMMQOYb2eU',
					createdAt: '2025-06-12T20:17:07.105Z',
					modifiedAt: '2025-06-12T20:17:07.105Z',
					userId: 'A9zwKYff2yyRmaqc9',
					isEnabled: true,
					isAdHoc: false,
					eventTypes: [
						'ACTOR.RUN.SUCCEEDED',
						'ACTOR.RUN.FAILED',
						'ACTOR.RUN.TIMED_OUT',
						'ACTOR.RUN.ABORTED',
					],
					condition: {
						actorId: 'nFJndFXA5zjCTuudP',
					},
					ignoreSslErrors: false,
					doNotRetry: false,
					// this URL is the same as the one in the webhook workflow - change with care
					requestUrl: 'http://localhost:5678/2726981e-4e01-461f-a548-1f467e997400/webhook',
					payloadTemplate:
						'{\n    "userId": {{userId}},\n    "createdAt": {{createdAt}},\n    "eventType": {{eventType}},\n    "eventData": {{eventData}},\n    "resource": {{resource}}\n}',
					lastDispatch: {
						status: 'SUCCEEDED',
						finishedAt: '2025-06-17T08:58:14.804Z',
						removedAt: null,
					},
					stats: {
						totalDispatches: 8,
					},
					actionType: 'HTTP_REQUEST',
					shouldInterpolateStrings: false,
				},
			],
		},
	};
};

export const getCreateWebhookResult = () => {
	return {
		data: {
			id: 'UcIMMQOYb2eWmLC3U',
			createdAt: '2025-06-12T20:17:07.105Z',
			modifiedAt: '2025-06-12T20:17:07.105Z',
			userId: 'A9zwKYff2yyRmaqc9',
			isEnabled: true,
			isAdHoc: false,
			eventTypes: [
				'ACTOR.RUN.SUCCEEDED',
				'ACTOR.RUN.FAILED',
				'ACTOR.RUN.TIMED_OUT',
				'ACTOR.RUN.ABORTED',
			],
			condition: {
				actorId: 'nFJndFXA5zjCTuudP',
			},
			ignoreSslErrors: false,
			doNotRetry: false,
			requestUrl: 'http://localhost:5678/2f9d9edc-fada-47f5-b452-768dd81027cf/webhook',
			payloadTemplate:
				'{\n    "userId": {{userId}},\n    "createdAt": {{createdAt}},\n    "eventType": {{eventType}},\n    "eventData": {{eventData}},\n    "resource": {{resource}}\n}',
			stats: {
				totalDispatches: 0,
			},
			actionType: 'HTTP_REQUEST',
			shouldInterpolateStrings: false,
		},
	};
};
