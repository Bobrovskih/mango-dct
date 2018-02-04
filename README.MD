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
    const parameters = {
        lastDays: 31,
        utmSource: 'yandex.ru',
        utmMedium: 'cpc',
        utmCampaign: 'skidka50'
    };

    const calls = await dct.calls(parameters).catch(err => console.log(err.message));
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

### метод calls
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

### метод createWebhook
Создает вебхук для прослушивания событий
```js
MangoDct.createWebhook(url); // => Webhooks
```
| Аргумент  | Тип  | Описание|
| ------------ | ------------ |------------ |
| url  | string   |  url адрес вебхука  |

Пример использования:
```js
const MangoDct = require('mango-dct');
const app = require('express')();
const dct = new MangoDct();

// создание  вебхуков
const webhook1 = dct.createWebhook('/mango-dct/webhook1');
const webhook2 = dct.createWebhook('/mango-dct/webhook2');
const webhook3 = dct.createWebhook('/mango-dct/webhook3');

// прослушивание вебхуков
webhook1.on('data', e => console.log('on webhook1', e));
webhook2.on('data', e => console.log('on webhook2', e));
webhook3.on('data', e => console.log('on webhook3', e));

// прослушивание событий от всех вебхуков
dct.allHooks.on('data', e => console.log('on any webhook', e));

// регистрация обработчиков
app.use(webhook1.handler);
app.use(webhook2.handler);
app.use(webhook3.handler);

app.use((req, res) => res.status(404).send({ error: 'not found' }));
app.listen(8080);
```

Класс `Webhooks` наследуется от [EventEmmitter](https://nodejs.org/dist/v8.0.0/docs/api/events.html#events_class_eventemitter/)
</br>
### свойство allHooks
Слушает события от всех созданных вебхуков
```js
MangoDct.allHooks;  // => EventEmmitter<any>
```
Пример:
```js
dct.allHooks.on('data', e => console.log('on any webhook', e));
```

### метод transform
Настраивает параметры для преобразования получаемых данных.
Преобразование будет использоваться для метода calls и вебхуков.
```js
MangoDct.transform(options);  // => void
```
| Аргумент  | Тип  | Описание|
| ------------ | ------------ |------------ |
| options  | object   |  объект с параметрами  |

Пример использования:
```js
dct.transform({ callStatus: true });
```

Возможные преобразования:

| Аргумент  | Тип  | Описание|
| ------------ | ------------ |------------ |
| callStatus  | boolean   |  добавляет свойство callTextStatus - текстовое значение статуса завершения звонка (callStatus). Например, при наличии свойства `callStatus: 1110` будет добавлено свойство `callTextStatus: 'Вызов завершен вызывающим абонентом'`   |

## класс Webhooks
Класс для создания обработчика вебхука
```js
const webhook = new Webhooks(pathname, dct);
```
| Аргумент  | Тип  | Описание|
| ------------ | ------------ |------------ |
| pathname  | string   |   адрес для прослушивания вебхука |
| dct  | MangoDct   |   экземпляр класса MangoDct |

### свойство handler
Создает и возвращает функцию-обработчик для express
```js
webhook.handler => Function
```

### метод hear
Слушает события вебхука по заданному фильтру
```js
webhook.hear(filter, handler);
```
| Аргумент  | Тип  | Описание|
| ------------ | ------------ |------------ |
| filter  | object   |  объект с параметрами для фильтра событий |
| handler  | function   |  колбэк функция |

Пример использования:
```js
webhook1.hear({ callType: 1 }, e => console.log('on callType 1', e));
webhook1.hear({ device: /tablet|desktop/i }, e => console.log('on  tablet or desktop device', e));
webhook1.hear({ callerNumber: /^7495/  }, e => console.log('on 7495 mask phone number', e));
webhook1.hear({ duration: /^[1-9]\d+/, utmMedium: 'cpc'  }, e => console.log('on duration >= 10 seconds and  utmMedium=cpc ', e));
```

### Отладка
 Для логирования запросов calls необходимо задать переменную `process.env.DEBUG=mango-dct:calls`
Пример лога:
```
mango-dct:calls <- GET https://widgets-api.mango-office.ru/v1/calltracking/224/calls?utmSource=yandex.ru&utmMedium=cpc&utmCampaign=skidka50&dateStart=2017-12-08T19:44Z&dateEnd=2018-01-08T19:44Z +0ms
```
Для логирования вебхуков необходимо задать переменную `process.env.DEBUG=mango-dct:webhooks`

Пример лога:
```
mango-dct:webhooks -> GET /mango-dct/webhook3?utm_source=yandex +15s
```
Для логирования запросов calls и вебхуков необходимо задать переменную 
`process.env.DEBUG=mango-dct:*`

