import { config } from '@n8n/node-cli/eslint';

export default [
	// include base n8n config first
	...config,

	// ignore patterns
	{
		ignores: [
			'.eslintrc.js',
			'**/*.js',
			'**/node_modules/**',
			'**/dist/**',
			'**//__tests__/**',
			'nodes/Apify/__tests__/**',
		],
	},

	// global rules
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},

	// package.json specific
	{
		files: ['package.json'],
		rules: {
			'n8n-nodes-base/community-package-json-name-still-default': 'off',
		},
	},

	// credentials specific
	{
		files: ['credentials/**/*.ts'],
		rules: {
			'n8n-nodes-base/cred-class-field-documentation-url-missing': 'off',
			'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
		},
	},

	// nodes specific
	{
		files: ['nodes/**/*.ts'],
		rules: {
			'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
			'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
			'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
			'n8n-nodes-base/node-param-default-wrong-for-options': 'off',
		},
	},
];
