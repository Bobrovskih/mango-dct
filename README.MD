## Библиотека для API  динамического коллтрекинга от MANGO OFFICE

[![API динамического коллтрекинга от Манго Офис](https://www.mango-office.ru/upload/iblock/c11/kt.png "Динамический коллтрекинг Манго Офис")](https://www.mango-office.ru/support/virtualnaya_ats/chasto_zadavaemye_voprosy/dinamicheskiy_kolltreking/api_dinamicheskogo_kolltreiknga/ "Динамический коллтрекинг Манго Офис")
### Установка
`npm install mango-dct`


### Требования
NodeJS версии 8 или более

### Токен
Токен можно задать через переменную `process.env.TOKEN`</br>
Или передать первый аргумент в конструктор 
`new MangoDct('your-token-here', 'your-widget-id');`

### ID виджета
ID виджета можно задать через переменную `process.env.WID`</br>
Или передать второй аргумент в конструктор 
`new MangoDct('your-token-here', 'your-widget-id');`

### Пример использования


```javascript
const MangoDct = require('mango-dct');
const dct = new MangoDct();

async function main() {
    let parameters;
    let calls;

    parameters = {
        lastDays: 31,
        utmSource: 'yandex.ru',
        utmMedium: 'cpc',
        utmCampaign: 'skidka50'
    };

    calls = await dct.calls(parameters).catch(err => console.log(err.message));
    console.log('выгруженные звонки', calls);
}
main();
```

[Все примеры](examples/)

## класс MangoDct
Создание нового экземпляра
```javascript
new MangoDct('your-token-here', 'your-widget-id');
```

| Аргумент  | Тип  | Описание|
| ------------ | ------------ |------------ |
| token  | String   |  Токен  |
| wid  | String   |  id виджета  |

### Метод calls
Данный метод возвращает список звонков на все подменные номера (включая номера статических каналов) за определенный промежуток времени. Список отсортирован по убыванию.


```js
MangoDct.calls(options); // => Promise<any[]>
```

| Аргумент  | Тип  | Описание|
| ------------ | ------------ |------------ |
| options  | object   |  Объект содержит фильтры выгрузки  |

</br>

Период выгрузки можно задать несколькими способами:


```js
// за последний 31 день
MangoDct.calls({ lastDays: '31' });
```
или
```js
// с 01 июня 2016 по 30 июня 2016
MangoDct.calls({ dateStart: '2017-06-01T00:00', dateEnd: '2017-06-30T00:00Z' });
```
или
```js
// за вчера
MangoDct.calls({ yesterday: true })
```
или
```js
// за сегодня
MangoDct.calls({ today: true })
```
</br>

 Возможные фильтры:

|   Название| Обязательность  |  Тип  | Описание  |   Значение по умолчанию|
| ------------ | ------------ | ------------ | ------------ | ------------ |
| dateStart  |  required  |  string |   дата и время в формате ISO 8601|   |
|  dateEnd  |  required  |   string | дата и время  формате ISO 8601  |   |
| callType | optional | number | Тип звонка: 0 - динамические и статические, 1 - динамические, 2 - статические, 3 - дефолтные | 0 |
| isNew | optional | number | Флаг нового звонка: 0 - все звонки, 1 - только новые | 0 |
| isQuality | optional | number |  Флаг качественного звонка: 0 - все звонки, 1 - только качественные | 0 |
| utmSource | optional | string |  Источник |  |
| utmMedium | optional | string |  Канал |  |
| utmCampaign | optional | string |  Кампания |  |
| utmContent | optional | string |  Содержание |  |
| utmTerm | optional | string |  Ключевое слово |  | |



### Отладка
Для логирования необходимо задать переменную `process.env.DEBUG=request`
</br>
Пример лога:
```
2017-12-27T18:23:38.033Z request -> https://widgets-api.mango-office.ru/v1/calltracking/224/calls?utmSource=yandex.ru&utmMedium=cpc&utmCampaign=skidka50&dateStart=2017-11-26T18:23Z&dateEnd=2017-12-27T18:23Z
```

