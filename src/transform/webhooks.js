const messages = require('../messages');

/**
 * Класс для преобразования параметров вебхука
 */
class Transform {
	/**
	 * @param {any} options - опции
	 * @param {any} query - параметры запроса
	 */
	constructor(options = {}, query = {}) {
		this.options = options;
		this.query = query;
		this.init();
	}
	/**
	 * Функция которая вызывает цепочкой обработчики.
	 * Обработчик будет вызван если его имя было передано в options.
	 * @return {Function}
	 */
	init() {
		const { options } = this;
		for (const key in options) {
			if (!Object.hasOwnProperty.call(options, key)) continue;
			if (!options[key]) continue;
			if (!this[key]) continue;

			this[key].call(this);
		}
	}
	
	/**
	 * Мапит код звонка в текст сообщения ВАТС
	 */
	callStatus() {
		const code = this.query.callStatus;
		if (code) {
			this.query.callTextStatus = messages.vpbx[code] || 'неизвестно';
		}
	}
}

module.exports = Transform;
