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

describe('MangoDct.createWebhook', () => {
	it('pathname', () => {
		const dct = new MangoDct('test', '0');
		const { pathname } = dct.createWebhook('http://localhost/hello/world');
		expect(pathname).equal('/hello/world');
	});
});

describe('MangoDct.calls', () => {
	it('got 401', (done) => {
		const dct = new MangoDct('test', '0');
		dct.calls({ today: true })
			.then(done)
			.catch((e) => {
				if (e.statusCode === 401) {
					done();
				}
			});
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

describe('MangoDct.request', () => {
	it('404', (done) => {
		const dct = new MangoDct('token', '123');
		dct.request('https://widgets-api.mango-office.ru/v1/calltracking/123/')
			.then(done)
			.catch((e) => {
				if (e.statusCode) {
					done();
				}
			});
	});
});
