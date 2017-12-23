const { should, expect, assert } = require('chai');
const Adapter = require('../src/adapter');

describe('hello unit', () => {
	it('true is true', () => {
		expect(true).equal(true);
	});
});

describe('метод Adapter.isValid', () => {
	it('заданы dateStart, dateEnd', () => {
		const params = {
			dateStart: '2017-06-30T00:00Z',
			dateEnd: '2017-06-01T00:00'
		};
		const result = Adapter.isValid(params);

		expect(result).equal(true);
	});

	it('не заданы dateStart, dateEnd', () => {
		const params = {
			datstart: '27 june',
			datend: '20 june'
		};
		const result = Adapter.isValid(params);

		expect(result).equal(false);
	});

	it('задан параметр lastDays', () => {
		const params = { lastDays: 31 };
		const result = Adapter.isValid(params);

		expect(result).equal(true);
	});

	it('не задан параметр lastDays', () => {
		const params = { days: 10 };
		const result = Adapter.isValid(params);

		expect(result).equal(false);
	});
});


describe('метод Adapter.stringer', () => {
	it('объект в строку параметров', () => {
		const options = {
			dateStart: '2017-06-11T00:00Z',
			dateEnd: '2017-06-30T00:00Z',
			isNew: 1,
			callType: 3,
			utmSource: 'google.com'
		};

		const result = Adapter.stringer(options);
		const dest = 'dateStart=2017-06-11T00%3A00Z&dateEnd=2017-06-30T00%3A00Z&isNew=1&callType=3&utmSource=google.com';

		expect(result).equal(dest);
	});
});

describe('метод Adapter.normalize', () => {
	it('объект с свойствами dateStart, dateEnd', () => {
		const options = {
			dateStart: '2017-06-11T00:00Z',
			dateEnd: '2017-06-30T00:00Z',
		};

		const result = Adapter.normalize(options);

		expect(result).deep.equal(options);
	});

	it('объект с свойством lastDays', () => {
		const options = { lastDays: 10 };
		const result = Adapter.normalize(options);

		expect(result).not.equal({ lastDays: 10 });
	});
});


describe('метод Adapter.lastDays', () => {
	it('lastDays -7', () => {
		const result = Adapter.lastDays.bind(Adapter, -7);
		const err = /^lastDays должно быть больше нуля$/;
		expect(result).to.throw(Error, err);
	});
    
	it('lastDays 0 ', () => {
		const result = Adapter.lastDays.bind(Adapter, 0);
		const err = /^lastDays должно быть больше нуля$/;
		expect(result).to.throw(Error, err);
	});
    
	it('lastDays 12', () => {
		const result = Adapter.lastDays.bind(Adapter, 12);
		expect(result).to.not.throw();
	});
});

describe('метод Adapter.trimToMinutes', () => {
	it('случайные дата-время', () => {
		const extDate = '2017-12-23T17:44:43.453Z';
		const result = Adapter.trimToMinutes(extDate);

		expect(result).equal('2017-12-23T17:44Z');
	});
});
