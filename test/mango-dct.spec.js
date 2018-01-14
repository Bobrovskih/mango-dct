const { expect } = require('chai');
const MangoDct = require('../src/mango-dct');


describe('метод MangoDct.transform', () => {
	let dct;
	beforeEach(() => {
		dct = new MangoDct('test', '0');
	});

	it('вызов без параметров', () => {
		dct.transform();
		expect(dct.options).deep.equal({});
	});
    
	it('параметр mapCallStatus', () => {
		const parameters = { mapCallStatus: true };
		dct.transform(parameters);

		expect(dct.options).deep.equal(parameters);
	});
    
	it('случайный параметр', () => {
		dct.transform({ somebody: false });
		expect(dct.options).deep.equal({ somebody: false });
	});
});
