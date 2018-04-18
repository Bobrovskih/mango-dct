const EventEmitter = require('events');

const Helpers = require('./helpers');
const Webhooks = require('./webhooks');
const Transform = require('./transform/calls');

const rp = require('request-promise');
const debug = require('debug')('mango-dct:calls');

require('./typings');

/**
 * Класс для работы с API динамического коллтрекинга от MANGO OFFICE
 */
class MangoDct {
	/**
     * @param {string} token токен виджета из личного кабинета
     * @param {string} wid id виджета из личного кабинета
     */
	constructor(token = process.env.TOKEN, wid = process.env.WID) {
		this.validateConstructor(token, wid);
		this.token = token;
		this.wid = wid;
		this.baseUrl = 'https://widgets-api.mango-office.ru/v1/calltracking/';
		this.options = {};
		this.allHooks = new EventEmitter();
	}

	/**
	 * Создает вебхук для прослушивания событий
	 * @param {string} url какой url слушать
	 */
	createWebhook(url) {
		const pathname = Helpers.pathname(url);
		return new Webhooks(pathname, this);
	}

	/**
     * Запрос на получение звонков
     * @param {Filter} options объект с параметрами для выгрузки
     * @return {Promise<Call[]>}
     */
	async calls(options) {
		const { csv } = options;
		Helpers.validate(options);
		Helpers.normalize(options);
		const params = Helpers.stringer(options);
		const url = this.createUrl(params, !!csv);

		const calls = await this.request(url);
		Helpers.makeCSV(csv, calls);
		return calls;
	}

	/**
	 * Настраивает параметры для преобразования получаемых данных
	 * @param {any} options объект с параметрами
	 * @example
	 * dct.transform({ callStatus: true });
	 */
	transform(options = {}) {
		for (const key in options) {
			if (options[key] !== undefined) {
				this.options[key] = options[key];
			}
		}
	}

	/**
     * Строит урл для GET запроса
     * @param {string} params строка параметров
	 * @param {boolean} [csv] формат csv
	 * @private
     */
	createUrl(params, csv) {
		const ext = csv ? '.csv' : '';
		return `${this.baseUrl}${this.wid}/calls${ext}?${params}`;
	}


	/**
     * Проверяет что токен и виджет id заданы
     * Иначе выбрасывает исключение
     *
     * @param {string} token токен
     * @param {string} wid идентификатор виджета
	 * @private
     */
	validateConstructor(token, wid) {
		if (!token) {
			throw new Error('Необходимо задать токен!');
		}
		if (!wid) {
			throw new Error('Необходимо задать идентификатор виджета!');
		}
		return true;
	}


	/**
     * Выполняет GET запрос
     * @param {string} url урл для запроса
     * @return {Promise<any>}
	 * @private
     */
	async request(url) {
		const options = {
			url,
			method: 'GET',
			json: true,
			headers: {
				Authorization: `Bearer ${this.token}`,
				'User-Agent': 'https://github.com/Bobrovskih/mango-dct',
			},
			transform: new Transform(this.options).init
		};
		debug(`<- ${options.method} ${decodeURIComponent(url)}`);
		return await rp(options);
	}
}

module.exports = MangoDct;
