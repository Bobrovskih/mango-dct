## Библиотека для API  динамического коллтрекинга от MANGO OFFICE

[![API динамического коллтрекинга от Манго Офис](https://www.mango-office.ru/upload/iblock/c11/kt.png "Динамический коллтрекинг Манго Офис")](https://www.mango-office.ru/support/virtualnaya_ats/chasto_zadavaemye_voprosy/dinamicheskiy_kolltreking/api_dinamicheskogo_kolltreiknga/ "Динамический коллтрекинг Манго Офис")
### Установка
`npm install mango-dct`


### Требования
NodeJS версии 8 или более

### Токен
Токен можно задать через переменную `process.env.token`</br>
Или передать первый аргумент в конструктор 
`new MangoDct('your-token-here', 'your-widget-id');`

### ID виджета
ID виджета можно задать через переменную `process.env.wid`</br>
Или передать второй аргумент в конструктор 
`new MangoDct('your-token-here', 'your-widget-id');`

### Пример использования


```javascript
const MangoDct = require('mango-dct');
const dct = new MangoDct();

async function main() {
    let parameters, calls;

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
MangoDct.calls({lastDays:'31', utmSource:'yandex.ru'}); // => Promise<any[]>
```

| Аргумент  | Тип  | Описание|
| ------------ | ------------ |------------ |
| options  | Object   |  Объект содержит фильтры выгрузки  |

</br>

Период выгрузки можно задать двумя способами:


```js
// за последний 31 день
MangoDct.calls({lastDays:'31'});
```
или
```js
// с 01 июня 2016 по 30 июня 2016
MangoDct.calls({dateStart:'2017-06-01T00:00', dateEnd:'2017-06-30T00:00Z'});
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




