const messages = require('../messages');

/**
 * Класс для преобразования тела ответа метода calls
 */
class Transform {
	/**
	 * @constructor
	 * @param {any} options параметры
	 */
	constructor(options = {}) {
		this.options = options;
	}
	/**
	 * Функция которая вызывает цепочкой обработчики.
	 * Обработчик будет вызван если его имя передано в параметры options.
	 * @return {function}
	 */
	get init() {
		const self = this;

		function caller(body, res) {
			const { options } = self;
			for (const key in options) {
				if (!Object.hasOwnProperty.call(options, key)) continue;
				if (!options[key]) continue;
				if (!self[key]) continue;

				self[key].call(this, body, res);
			}
			return body;
		}

		return caller;
	}
	
	/**
	 * Мапит код звонка в текст сообщения ВАТС
	 * @param {any} body тело ответа от request-promise
	 * @param {any} res res объект от request-promise
	 */
	callStatus(body, res) {
		if (res.statusCode === 200 && body.length > 0) {
			body = body.map((item) => {
				item.callTextStatus = messages.vpbx[item.callStatus] || 'неизвестно';
				return item;
			});
		}
	}
}

module.exports = Transform;
