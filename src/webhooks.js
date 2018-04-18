const EventEmitter = require('events');
const debug = require('debug')('mango-dct:webhooks');
const Transform = require('./transform/webhooks');
const Helpers = require('./helpers');

require('./typings');

/**
 * Класс для работы с вебхуками
 */
class Webhooks extends EventEmitter {
	constructor(pathname, dct) {
		super();
		this.pathname = pathname;
		this.dct = dct;
		this.poolHear = [];
	}

	/**
	 * Функция-обработчик для express
	 * @return {(req: any, res: any, next: function) =>}
	 */
	get handler() {
		return (req, res, next) => {
			if (this.pathname === req.path) {
				debug(`-> ${req.method} ${decodeURIComponent(req.originalUrl)}`);
				new Transform(this.dct.options, req.query);
				this.invokeHear(req.query);
				this.emit('data', req.query);
				this.dct.allHooks.emit('data', req.query);
				return res.send({
					status: 200
				});
			}
			return next();
		};
	}

	/**
	 * Слушает вебхуки по заданному фильтру
	 * @param {Call} filter фильтр
	 * @param {(e:Call) => } handler обработчик
	 */
	hear(filter, handler) {
		const newHear = {
			filter,
			handler
		};
		this.poolHear.push(newHear);
	}

	/**
	 * Проверяет и вызывает обработчики hear
	 * @param {Call} json параметры
	 * @private
	 */
	invokeHear(json) {
		this.poolHear
			.forEach((hear) => {
				const {
					filter
				} = hear;
				if (Helpers.testFilter(filter, json)) {
					hear.handler.call(this, json);
				}
			}, this);
	}
}


module.exports = Webhooks;
