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
}


module.exports = Adapter;
