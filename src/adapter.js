const qs = require('querystring');
const url = require('url');
const { allParams, requiredParams } = require('./parameters');

/**
 * Класс со статическими вспомогательными методами
 */
class Adapter {
	/**
	 * Проверяет параметры на корректность
	 * @param {any} params - объект с параметрами GET запроса
	 */
	static validate(params) {
		if (parseInt(params.lastDays, 10)) {
			return true;
		}
		
		if (params.yesterday) {
			return true;
		}

		if (params.today) {
			return true;
		}

		return requiredParams.every((item) => {
			for (const key in params) {
				if (key === item) {
					return true;
				}
			}
			throw new Error('переданы не верные параметры');
		});
	}

	/**
	 * Преобразует объект в строку параметров
	 *
	 * @param { any } params - объект с параметрами GET запроса
	 * @return { string }
	 */
	static stringer(params) {
		for (const key in params) {
			if (allParams.indexOf(key) === -1) {
				delete params[key];
			}
		}

		return qs.stringify(params);
	}

	/**
	 * Выставляет дату в options
	 * В зависимости от переданных параметров
	 */
	static normalize(options) {
		if (options.lastDays) {
			const { dateStart, dateEnd } = this.lastDays(options.lastDays);
			options.dateStart = dateStart;
			options.dateEnd = dateEnd;
			return options;
		}

		if (options.today) {
			const { dateStart, dateEnd } = this.getTodayPeriod();
			options.dateStart = dateStart;
			options.dateEnd = dateEnd;
			return options;
		}

		if (options.yesterday) {
			const { dateStart, dateEnd } = this.getYesterdayPeriod();
			options.dateStart = dateStart;
			options.dateEnd = dateEnd;
			return options;
		}

		return options;
	}

	/**
	 * Устанавливает для параметров значения по умолчанию
	 * @param {any} options - объект с параметрами GET запроса
	 * @return {any}
	 */
	static setDefaults(options) {
		options.callType = options.callType || 0;
		options.isNew = options.isNew || 0;
		options.isQuality = options.isQuality || 0;
		return options;
	}

	/**
	 * Принимает количество дней.
	 * Возвращает объект с датой начала и конца в формате ISO 8601
	 * @param {string} value
	 * @return {any}
	 */
	static lastDays(value) {
		let dateStart;
		let dateEnd;

		value = Number(value);

		if (value > 31) {
			throw new Error('максимальный период выгрузки 31 день');
		}
		if (value < 1) {
			throw new Error('lastDays должно быть больше нуля');
		}

		dateStart = new Date(new Date().getTime() - (value * 24 * 60 * 60 * 1000)).toISOString();
		dateStart = this.trimToMinutes(dateStart);

		dateEnd = new Date().toISOString();
		dateEnd = this.trimToMinutes(dateEnd);

		return {
			dateStart,
			dateEnd
		};
	}

	/**
	 * Преобразует дату из расширенного формата ISO 8601
	 * В стандартный формат ISO 8601
	 *
	 * @param {string} isoDate - дата-время в *расширенном* формате формате ISO
	 * @return {string}
	 */
	static trimToMinutes(isoDate) {
		const pattern = /:\d{2}\.\d{3}/;
		return isoDate.replace(pattern, '');
	}

	/**
	 * Возвращает период за вчерашний день.
	 * В формате ISO 8601 (short)
	 *
	 * @return {any}
	 */
	static getYesterdayPeriod() {
		let dateStart = new Date();
		dateStart.setDate(dateStart.getDate() - 1);
		dateStart.setHours(0);
		dateStart.setMinutes(0);
		dateStart = dateStart.toISOString();
		dateStart = this.trimToMinutes(dateStart);

		let dateEnd = new Date();
		dateEnd.setHours(0);
		dateEnd.setMinutes(0);
		dateEnd = dateEnd.toISOString();
		dateEnd = this.trimToMinutes(dateEnd);

		return {
			dateStart,
			dateEnd
		};
	}

	/**
	 * Возвращает период за сегодняшний день
	 * в формате ISO 8601 (short)
	 */
	static getTodayPeriod() {
		let dateStart = new Date();
		dateStart.setHours(0);
		dateStart.setMinutes(0);
		dateStart = dateStart.toISOString();
		dateStart = this.trimToMinutes(dateStart);

		let dateEnd = new Date();
		dateEnd = dateEnd.toISOString();
		dateEnd = this.trimToMinutes(dateEnd);

		return {
			dateStart,
			dateEnd
		};
	}

	/**
	 * Возвращает pathname от переданного урла
	 * @param {string} input - урл
	 * @return {string}
	 */
	static pathname(input) {
		return url.parse(input).pathname;
	}

	/**
	 * Определяет тип переменной.
	 * @param {any} variable - переменная
	 * @return {string} - в нижнем регистре
	 */
	static typeOf(variable) {
		let type = Object.prototype.toString.call(variable);
		type = type.slice(8, -1);
		type = type.toLowerCase();
		return type;
	}

	/**
	 * Возвращает переданную строку в нижнем регистре
	 * Если передана не строка, то просто возвращает исходное значение.
	 * @param {string | any} input - исходное значение
	 */
	static toLowerCase(input) {
		const isString = this.typeOf(input) === 'string';
		const isNumber = this.typeOf(input) === 'number';

		if (isString) {
			return input.toLowerCase();
		}

		if (isNumber) {
			return String(input).toLowerCase();
		}
		return input;
	}


	/**
	 * Проверяет является ли пустым объектом (нет ниодного свойства)
	 * @param {any} input - данные
	 * @return {boolean}
	 */
	static isEmptyObject(input) {
		const type = Adapter.typeOf(input);
		if (type === 'object') {
			const keysCount = Object.keys(input).length;
			return keysCount === 0;
		}
		return false;
	}

	/**
	 * Проверяет подходит ли фильтр под параметры
	 * @param {string} event - имя ивента
	 * @param {any} filter - фильтр
	 * @param {any} json - параметры
	 * @return {boolean}
	 */
	static testFilter(filter, json) {
		if (Adapter.typeOf(filter) !== 'object') {
			return false;
		}

		if (Adapter.isEmptyObject(filter)) {
			return true;
		}

		for (const key in filter) {
			if (filter[key] === null || filter[key] === undefined) continue;

			if (Adapter.typeOf(filter[key]) === 'regexp') {
				return filter[key].test(json[key]);
			}

			const filterVal = Adapter.toLowerCase(filter[key]);
			const jsonVal = Adapter.toLowerCase(json[key]);

			if (filterVal !== jsonVal) {
				return false;
			}
		}
		return true;
	}
}


module.exports = Adapter;
