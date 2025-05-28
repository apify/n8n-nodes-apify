import { Apify } from '../Apify/Apify.node';

describe('Apify Node', () => {
	let apifyNode: Apify;

	beforeEach(() => {
		apifyNode = new Apify();
	});

	describe('description', () => {
		it('should have a name property', () => {
			expect(apifyNode.description.name).toBeDefined();
			expect(apifyNode.description.name).toEqual('apify');
		});

		it('should have a version property', () => {
			expect(apifyNode.nodeVersions).toBeDefined();
		});

		it('should have a base description', () => {
			expect(apifyNode.description.displayName).toBeDefined();
			expect(apifyNode.description.name).toBeDefined();
			expect(apifyNode.description.icon).toBeDefined();
			expect(apifyNode.description.group).toBeDefined();
			expect(apifyNode.description.description).toBeDefined();
			expect(apifyNode.description.defaultVersion).toBeDefined();
		});
	});
});
