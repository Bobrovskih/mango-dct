const { expect } = require('chai');
const Helpers = require('../src/helpers');

describe('hello unit', () => {
	it('true is true', () => {
		expect(true).equal(true);
	});
});

describe('метод Helpers.validate', () => {
	it('заданы dateStart, dateEnd', () => {
		const params = {
			dateStart: '2017-06-30T00:00Z',
			dateEnd: '2017-06-01T00:00Z'
		};
		const result = Helpers.validate.bind(Helpers, params);

		expect(result).not.throw();
	});

	it('не заданы dateStart, dateEnd', () => {
		const params = {
			datstart: '27 june',
			datend: '20 june'
		};
		const result = Helpers.validate.bind(Helpers, params);
		const err = /^переданы не верные параметры$/;
		expect(result).throw(Error, err);
	});

	it('задан параметр lastDays', () => {
		const params = { lastDays: 31 };
		const result = Helpers.validate.bind(Helpers, params);
		expect(result).not.throw();
	});

	it('не задан параметр lastDays', () => {
		const params = { days: 10 };
		const result = Helpers.validate.bind(Helpers, params);
		const err = /^переданы не верные параметры$/;
		expect(result).throw(Error, err);
	});

	it('задан параметр yesterday', () => {
		const params = { yesterday: true };
		const result = Helpers.validate.bind(Helpers, params);
		expect(result).not.throw();
	});

	it('задан параметр today', () => {
		const params = { today: true };
		const result = Helpers.validate.bind(Helpers, params);
		expect(result).not.throw();
	});
});


describe('метод Helpers.stringer', () => {
	it('объект в строку параметров', () => {
		const options = {
			dateStart: '2017-06-11T00:00Z',
			dateEnd: '2017-06-30T00:00Z',
			isNew: 1,
			callType: 3,
			utmSource: 'google.com'
		};

		const result = Helpers.stringer(options);
		const dest = 'dateStart=2017-06-11T00%3A00Z&dateEnd=2017-06-30T00%3A00Z&isNew=1&callType=3&utmSource=google.com';

		expect(result).equal(dest);
	});
});

describe('метод Helpers.normalize', () => {
	it('объект с свойствами dateStart, dateEnd', () => {
		const options = {
			dateStart: '2017-06-11T00:00Z',
			dateEnd: '2017-06-30T00:00Z',
		};

		const result = Helpers.normalize(options);

		expect(result).deep.equal(options);
	});

	it('объект с свойством lastDays', () => {
		const options = { lastDays: 10 };
		const result = Helpers.normalize(options);

		expect(result).not.equal({ lastDays: 10 });
	});
});


describe('метод Helpers.lastDays', () => {
	it('lastDays -7', () => {
		const result = Helpers.lastDays.bind(Helpers, -7);
		const err = /^lastDays должно быть больше нуля$/;
		expect(result).to.throw(Error, err);
	});
    
	it('lastDays 0 ', () => {
		const result = Helpers.lastDays.bind(Helpers, 0);
		const err = /^lastDays должно быть больше нуля$/;
		expect(result).to.throw(Error, err);
	});
    
	it('lastDays 12', () => {
		const result = Helpers.lastDays.bind(Helpers, 12);
		expect(result).to.not.throw();
	});

	it('lastDays 32', () => {
		const result = Helpers.lastDays.bind(Helpers, 32);
		const err = /^максимальный период выгрузки 31 день$/;
		expect(result).to.throw(Error, err);
	});
});

describe('метод Helpers.trimToMinutes', () => {
	it('случайные дата-время', () => {
		const extDate = '2017-12-23T17:44:43.453Z';
		const result = Helpers.trimToMinutes(extDate);

		expect(result).equal('2017-12-23T17:44Z');
	});
});

describe('метод Helpers.pathname', () => {
	it('случайный url', () => {
		const result = Helpers.pathname('http://localhost:8080/mango-dct/webhook1?utm_source=vk');
		expect(result).to.equal('/mango-dct/webhook1');
	});

	it('только pathname', () => {
		const result = Helpers.pathname('/mango-dct/webhook2');
		expect(result).to.equal('/mango-dct/webhook2');
	});

	it('pathname search hash', () => {
		const result = Helpers.pathname('/mango/dct?utm_content=chtoto#gdeto');
		expect(result).to.equal('/mango/dct');
	});

	it('пустой url', () => {
		const result = Helpers.pathname('');
		expect(result).to.equal(null);
	});
});

describe('метод Helpers.testFilter', () => {
	let json;

	beforeEach(() => {
		json = {
			dateStart: '2017-06-30T00:00Z',
			dateEnd: '2017-06-01T00:00Z',
			callType: 1,
			waitDuration: 16,
			duration: 124,
			number: 74950000000,
			callStatus: 1110,
			callerNumber: 74959999999,
			utmSource: 'https://direct.yandex.ru',
			utmMedium: 'cpc',
			device: 'tablet'
		};
	});

	it('{} [true]', () => {
		const filter = {};
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('callType:1 [true]', () => {
		const filter = { callType: 1 };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('callType:"1" [true]', () => {
		const filter = { callType: '1' };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('callType:1 duration:10 [true]', () => {
		const filter = { callType: 1, duration: 124 };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('calltype:1 [false]', () => {
		const filter = { calltype: 1 };
		const due = false;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('utmMedium:"cpc", waitDuration:16 [true]', () => {
		const filter = { utmMedium: 'cpc', waitDuration: 16 };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('utmMedium:" cpc" ', () => {
		const filter = { utmMedium: ' cpc' };
		const due = false;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('utmMedium:"" ', () => {
		const filter = { utmMedium: '' };
		const due = false;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('utmSource:/yandex/ [true]', () => {
		const filter = { utmSource: /yandex/ };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('utmSource:/yandex/ [true]', () => {
		const filter = { utmSource: /yandex/ };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('device:/tablet|desktop/ [true]', () => {
		const filter = { device: /tablet|desktop/ };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('number:/^7495/ [true]', () => {
		const filter = { number: /^7495/ };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('callType:/[1-3]/, number:/^7495/ [true]', () => {
		const filter = { callType: /[1-3]/, number: /^7495/ };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('callType:1, waitDuration:"16", device:/CPC/i [true]', () => {
		const filter = { callType: 1, waitDuration: '16', utmMedium: /CPC/i };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('callType:/1,2/g  [false]', () => {
		const filter = { callType: /1,2/g };
		const due = false;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('custom: 12345  [false]', () => {
		const filter = { custom: 12345 };
		const due = false;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('device:true  [false]', () => {
		const filter = { device: true };
		const due = false;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});

	it('dateStart: "2017-06-30T00:00Z", waitDuration: /[1-9]\\d+/  [true]', () => {
		const filter = { dateStart: '2017-06-30T00:00Z', waitDuration: /[1-9]\d+/ };
		const due = true;

		const result = Helpers.testFilter(filter, json);
		expect(result).equal(due);
	});
});
