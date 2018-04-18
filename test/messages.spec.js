const {
	expect,
} = require('chai');
const {
	vpbx
} = require('../src/messages');

describe('messages', () => {
	it('1000', () => {
		const result = vpbx[1000];
		expect(result).equal('Действие успешно выполнено');
	});

	it('1008', () => {
		const result = vpbx[1008];
		expect(result).equal(undefined);
	});
});
