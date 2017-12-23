const qs = require('querystring');

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

        if (parseInt(params.lastDays, 10)) {
            return true;
        }

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
     * 
     */
    static normalize(options) {

        if (options.lastDays) {
            let { dateStart, dateEnd } = this.lastDays(options.lastDays);
            options.dateStart = dateStart;
            options.dateEnd = dateEnd;
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
     * Возвращает объект с датой начала и конца в формате ISO
     * @param {string} value
     * @return {any}
     */
    static lastDays(value) {
        let dateStart, dateEnd;

        value = Number(value);

        if (value > 31) {
            throw new Error('максимальный период выгрузки 31 день');
        }
        if (value < 1) {
            throw new Error('некорректное значение lastDays');
        }

        dateStart = new Date(new Date().getTime() - value * 24 * 60 * 60 * 1000).toISOString();
        dateStart = this.trimToMinutes(dateStart);

        dateEnd = new Date().toISOString();
        dateEnd = this.trimToMinutes(dateEnd);

        return { dateStart: dateStart, dateEnd: dateEnd };
    }

    static trimToMinutes(isoDate) {
        const pattern = /\:\d{2}\.\d{3}/;
        return isoDate.replace(pattern, '');
    }
}


module.exports = Adapter;