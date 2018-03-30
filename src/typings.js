/* eslint max-len: "off" */

/**
 * @typedef Call информация о звонке на подменный номер
 * @property {string} callId id звонка
 * @property {string} dateStart Время поступления звонка в формате ISO 8601: DD-MM-YYYYThh:mmZ
 * @property {string} dateEnd Время окончания звонка в формате ISO 8601: DD-MM-YYYYThh:mmZ
 * @property {number} callType Тип звонка: 1 - динамический, 2 - статический, 3 - дефолтный
 * @property {number} callStatus Статус завершения звонка как в ВАТС API, 11XX- звонок был принят, иначе - отклонён
 * @property {number} number Динамический номер, на который был принят звонок
 * @property {number} callerNumer Номер звонившего
 * @property {duration} number Продолжительность звонка в секундах. Считается только продолжительность разговора с оператором. Без учета времени ожидания в IVR и ожидания распределения звонка внутри группы операторов.
 * @property {number} waitDuration Время ожидания до соединения с оператором в секундах
 * @property {boolean} isNew Флаг уникального звонка
 * @property {boolean} isQuality Флаг качественного звонка
 * @property {boolean} isDuplicate Флаг того, что с этого номера звонили последние 3 месяца
 * @property {string} uid Уникальный идентификатор клиента MANGO OFFICE
 * @property {string} gaCid Идентификатор клиента Google Analytics
 * @property {string} yaCid Идентификатор клиента Яндекс Метрики
 * @property {string} utmSource Источник
 * @property {string} utmMedium Канал
 * @property {string} utmCampaign Кампания
 * @property {string} utmContent Содержание (объявления)
 * @property {string} utmTerm Ключевое слово
 * @property {string} countryCode Код ISO страны
 * @property {string} regionCode Код ISO региона
 * @property {string} city Название города
 * @property {string} device Тип устройства: desktop, tablet или mobile
 * @property {string} ip IP адрес пользователя
 * @property {string} url Адрес страницы сайта, с которой был совершён звонок
 * @property {string} firstUrl Адрес страницы входа пользователя на сайт
 * @property {string} customParam Дополнительные параметры, передаваемые в код виджета тем, кто разместил его на сайте. Ограничение - 100 символов.
 */
