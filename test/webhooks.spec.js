const {
	EventEmitter
} = require('events');

const {
	assert,
} = require('chai');
const Webhooks = require('../src/webhooks');


describe('Webhooks', () => {
	it('class create', () => {
		assert.isFunction(Webhooks);
	});

	const dct = {
		allHooks: new EventEmitter(),
	};
	const webhook = new Webhooks('/somebody', dct);
	const req = {
		query: { param: 'value' },
		path: '/somebody',
	};
	const res = {
		send: () => 'mock',
	};
	const next = () => 'mock';

	it('emit allhooks', (done) => {
		dct.allHooks.on('data', () => {
			done();
			dct.allHooks.removeListener(done);
		});
		webhook.handler(req, res, next);
	});
    
	it('emit hook', (done) => {
		webhook.on('data', () => {
			done();
			webhook.removeListener(done);
		});
		webhook.handler(req, res, next);
	});
    
	it('emit hear', (done) => {
		webhook.hear({ param: 'value' }, () => done());
		webhook.handler(req, res, next);
	});
    
	it('next called', (done) => {
		const request = {
			query: { param: 'value' },
			path: '/missed',
		};
		webhook.handler(request, res, done);
	});
});
