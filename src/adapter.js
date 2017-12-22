const qs = require('querystring');
const rp = require('request-promise');

const { allParams, requiredParams } = require('./parameters');

/**
 * Класс со статическими вспомогательными методами
 */
class Adapter {
    constructor() { }

    /**
     * Проверяет параметры на корректность
     * @param {any} params - объект с параметрами GET запроса
     * @return {Boolean}
     */
    static isValid(params) {

        return requiredParams.every(item => {
            for (let key in params) {
                if (key === item) {
                    return true;
                }
            }
            return false;
        });

    }

    /**
     * Преобразует объект в строку параметров
     * 
     * @param { any } params - объект с параметрами GET запроса
     * @return { string }
     */
    static stringer(params) {
        for (let key in params) {
            if (allParams.indexOf(key) === -1) {
                delete params[key];
            }
        }
        return qs.stringify(params);
    }

    /**
     * Выполняет GET запрос
     * @param {string} url  - урл для запроса
     * @return {Promise<any>}
     */
    static request(url) {
        console.log('request->', url);
        let options = {
            url:url,
            method:'GET',
            json:true
        };
        return rp(options);
    }
}


module.exports = Adapter;