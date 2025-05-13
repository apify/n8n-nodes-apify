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

		it('should have properties defined', () => {
			expect(apifyNode.description.properties).toBeDefined();
		});

		it('should have credential properties defined', () => {
			expect(apifyNode.description.credentials).toBeDefined();
		});
	});
});
