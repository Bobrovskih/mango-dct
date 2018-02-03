const EventEmitter = require('events');
const debug = require('debug')('mango-dct:webhooks');
const Transform = require('./transform/webhooks');
const Adapter = require('./adapter');

class Webhooks extends EventEmitter {
	constructor(pathname, dct) {
		super();
		this.pathname = pathname;
		this.dct = dct;
		this.poolHear = [];
	}

	/**
	 * Функция-обработчик для express
	 * @return {Function}
	 */
	get handler() {
		return (req, res, next) => {
			if (this.pathname === req.path) {
				debug(`-> ${req.method} ${decodeURIComponent(req.originalUrl)}`);
				const transform = new Transform(this.dct.options, req.query);
				this.invokeHear(req.query);
				this.emit('data', req.query);
				this.dct.allHooks.emit('data', req.query);
				return res.send({ status: 200 });
			}
			return next();
		};
	}

	hear(filter, handler) {
		const newHear = { filter, handler };
		this.poolHear.push(newHear);
	}

	/**
	 * Проверяет и вызывает обработчики hear
	 * @param {any} json - параметры
	 */
	invokeHear(json) {
		this.poolHear
			.forEach((hear) => {
				const { filter } = hear;
				if (Adapter.testFilter(filter, json)) {
					hear.handler.call(this, json);
				}
			}, this);
	}
}


module.exports = Webhooks;
