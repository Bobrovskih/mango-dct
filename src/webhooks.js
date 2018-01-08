const EventEmitter = require('events');
const debug = require('debug')('mango-dct:webhooks');

class Webhooks extends EventEmitter {
	constructor(pathname, all) {
		super();
		this.pathname = pathname;
		this.all = all;
	}

	/**
	 * Функция-обработчик для express
	 * @return {Function}
	 */
	get handler() {
		return (req, res, next) => {
			if (this.pathname === req.path) {
				debug(`-> ${req.method} ${decodeURIComponent(req.originalUrl)}`);
				this.emit('data', req.query);
				this.all.emit('data', req.query);
				return res.send({ status: 200 });
			}
			return next();
		};
	}
}


module.exports = Webhooks;
