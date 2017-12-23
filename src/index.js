const Adapter = require('./adapter');
const rp = require('request-promise');

/**
 * Класс для работы с API динамического коллтрекинга от MANGO OFFICE
 */
class MangoDct {

    /**
     * @param { string } token - токен виджета из личного кабинета
     * @param { string } wid - id виджета из личного кабинета
     */
    constructor(token = process.env.token, wid = process.env.wid) {
        this.validateConstructor(token, wid);
        this.token = token;
        this.wid = wid;
        this.baseUrl = `https://widgets-api.mango-office.ru/v1/calltracking/`;

    }

    /**
     * Делает запрос для получения звонков
     * 
     * 
     * @param {any} options - объект с параметрами для выгрузки 
     * @return {Promise<Array>}
     */
    calls(options) {
        let params, url;

        options.access_token = this.token;

        if (!Adapter.isValid(options)) {
            throw new Error('переданы не верные параметры');
            return;
        };

        options = Adapter.normalize(options);
        params = Adapter.stringer(options);
        url = this.createUrl(params);

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
            throw new Error('Необходимо задать id виджета')
        }
        return true;
    }


    /**
     * Выполняет GET запрос
     * @param {string} url  - урл для запроса
     * @return {Promise<any>}
     */
    request(url) {
        console.log('request->', url);
        let options = {
            url: url,
            method: 'GET',
            json: true,
            headers:{
                'Authorization': `Bearer ${this.token}`
            }
        };
        return rp(options);
    }


}

module.exports = MangoDct;