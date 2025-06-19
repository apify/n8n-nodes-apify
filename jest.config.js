module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/nodes', '<rootDir>/credentials'],
	// testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
	testMatch: ['**/ApifyTrigger.node.spec.ts'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'js', 'json'],
};
