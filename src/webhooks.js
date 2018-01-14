const EventEmitter = require('events');
const debug = require('debug')('mango-dct:webhooks');
const Transform = require('./transform/webhooks');

class Webhooks extends EventEmitter {
	constructor(pathname, dct) {
		super();
		this.pathname = pathname;
		this.dct = dct;
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
				this.emit('data', req.query);
				this.dct.allHooks.emit('data', req.query);
				return res.send({ status: 200 });
			}
			return next();
		};
	}
}


module.exports = Webhooks;
