const { expect } = require('chai');
const MangoDct = require('..');

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

describe('MangoDct.createWebhook', () => {
	it('pathname', () => {
		const dct = new MangoDct('test', '0');
		const { pathname } = dct.createWebhook('http://localhost/hello/world');
		expect(pathname).equal('/hello/world');
	});
});

describe('MangoDct.calls', () => {
	it('224', async () => {
		const dct = new MangoDct('ceb0b254e8d168a9712c290b1b6517102f775f14', '224');
		const res = await dct.calls({ today: true });
		expect(res).instanceOf(Array);
	});
});

describe('MangoDct.validateConstructor', () => {
	it('token, wid', () => {
		try {
			new MangoDct();
			expect.fail();
		} catch (error) {
			const { message } = error;
			expect(message).equal('Необходимо задать токен!');
		}
	});
	it('wid', () => {
		try {
			new MangoDct('token');
			expect.fail();
		} catch (error) {
			const { message } = error;
			expect(message).equal('Необходимо задать идентификатор виджета!');
		}
	});
	it('token', () => {
		try {
			new MangoDct('', '123');
			expect.fail();
		} catch (error) {
			const { message } = error;
			expect(message).equal('Необходимо задать токен!');
		}
	});

	it('ok', () => {
		const dct = new MangoDct('token', '123');
		expect(dct).instanceof(MangoDct);
	});
});

describe('MangoDct.createUrl', () => {
	it('csv', () => {
		const dct = new MangoDct('token', '123');
		const params = 'dateStart=2018-03-18T21%3A00Z&dateEnd=2018-04-18T21%3A00Z';
		const csv = true;
		const result = dct.createUrl(params, csv);
		const due = 'https://widgets-api.mango-office.ru/v1/calltracking/123/calls.csv?dateStart=2018-03-18T21%3A00Z&dateEnd=2018-04-18T21%3A00Z';
		expect(result).equal(due);
	});
	it('default format', () => {
		const dct = new MangoDct('token', '123');
		const params = 'dateStart=2018-03-18T21%3A00Z&dateEnd=2018-04-18T21%3A00Z';
		const csv = false;
		const result = dct.createUrl(params, csv);
		const due = 'https://widgets-api.mango-office.ru/v1/calltracking/123/calls?dateStart=2018-03-18T21%3A00Z&dateEnd=2018-04-18T21%3A00Z';
		expect(result).equal(due);
	});
});
