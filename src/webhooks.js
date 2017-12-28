const EventEmitter = require('events');
const util = require('util');

class Webhooks extends EventEmitter {
	constructor() {
		super();
	}

	/**
	 * Создает обработчик для вебхука
	 * @param {string} path - url путь обработчика (pathname)
	 * @return {Function}
	 */
	create(path) {
		const self = this;
		function ret(req, res, next) {
			if (path === req.path) {
				this.emit('data', req.query);
				self.emit('data', req.query);
				return res.send({
					accept: true
				});
			}
			return next();
		}

		util.inherits(ret, EventEmitter);
		return ret;
	}
}

module.exports = Webhooks;
