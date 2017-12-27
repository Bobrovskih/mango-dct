const Adapter = require('./adapter');
const rp = require('request-promise');
const debug = require('debug')('request');

/**
 * Класс для работы с API динамического коллтрекинга от MANGO OFFICE
 */
class MangoDct {
	/**
     * @param { string } token - токен виджета из личного кабинета
     * @param { string } wid - id виджета из личного кабинета
     */
	constructor(token = process.env.TOKEN, wid = process.env.WID) {
		this.validateConstructor(token, wid);
		this.token = token;
		this.wid = wid;
		this.baseUrl = 'https://widgets-api.mango-office.ru/v1/calltracking/';
	}

	/**
     *  Запрос на получение звонков
     *
     * @param {any} options - объект с параметрами для выгрузки
     * @return {Promise<Array>}
     */
	calls(options) {
		Adapter.validate(options);
		Adapter.normalize(options);
		const params = Adapter.stringer(options);
		const url = this.createUrl(params);

		return this.request(url);
	}

	/**
     * Строит урл для GET запроса
     * @param {string} params - строка параметров
     */
	createUrl(params) {
		return `${this.baseUrl}${this.wid}/calls?${params}`;
	}


	/**
     * Проверяет что токен и виджет id заданы
     * Иначе выбрасывает исключение
     *
     * @param {string} token - токен
     * @param {string} wid  - виджет id
     */
	validateConstructor(token, wid) {
		if (!token) {
			throw new Error('Необходимо задать токен!');
		}
		if (!wid) {
			throw new Error('Необходимо задать id виджета');
		}
		return true;
	}


	/**
     * Выполняет GET запрос
     * @param {string} url  - урл для запроса
     * @return {Promise<any>}
     */
	request(url) {
		const options = {
			url,
			method: 'GET',
			json: true,
			headers: {
				Authorization: `Bearer ${this.token}`
			}
		};
		debug(`-> ${options.method} ${decodeURIComponent(url)}`);
		return rp(options);
	}
}

module.exports = MangoDct;
